"""Authentication service."""

from datetime import datetime, timedelta, UTC
from typing import Optional
from uuid import UUID
from jose import JWTError, jwt
from app.config.security import SecurityUtils, JWTConfig
from app.config.settings import settings
from app.repositories.user_repository import UserRepository
from app.core.exceptions import (
    InvalidCredentialsException,
    InvalidTokenException,
    EmailNotVerifiedException,
    AccountInactiveException,
    ConflictException,
)
from app.models.user import User
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Service for authentication operations."""

    def __init__(self, user_repository: UserRepository):
        """Initialize auth service.

        Args:
            user_repository: User repository instance.
        """
        self.user_repository = user_repository

    async def register(
        self, email: str, username: str, password: str
    ) -> User:
        """Register a new user.

        Args:
            email: User email.
            username: User username.
            password: Plain text password.

        Returns:
            User: Created user object.

        Raises:
            ConflictException: If email or username already exists.
        """
        # Check if user already exists
        if await self.user_repository.exists(email=email, username=username):
            raise ConflictException("Email or username already exists")

        # Hash password
        password_hash = SecurityUtils.hash_password(password)

        # Create user
        user = await self.user_repository.create(
            email=email,
            username=username,
            password_hash=password_hash,
        )

        logger.info(f"User registered: {email}")
        return user

    async def authenticate(self, email: str, password: str) -> User:
        """Authenticate user with email and password.

        Args:
            email: User email.
            password: Plain text password.

        Returns:
            User: Authenticated user object.

        Raises:
            InvalidCredentialsException: If credentials are invalid.
            EmailNotVerifiedException: If email is not verified.
            AccountInactiveException: If account is inactive.
        """
        user = await self.user_repository.get_by_email(email)

        if not user or not SecurityUtils.verify_password(password, user.password_hash):
            raise InvalidCredentialsException()

        if not user.is_active:
            raise AccountInactiveException()

        if not user.is_verified:
            raise EmailNotVerifiedException()

        logger.info(f"User authenticated: {email}")
        return user

    def create_access_token(self, user_id: UUID) -> tuple[str, int]:
        """Create JWT access token.

        Args:
            user_id: User ID to encode in token.

        Returns:
            tuple: Token string and expiration time in seconds.
        """
        expire_delta = JWTConfig.get_access_token_expire_time()
        return self._create_token(
            data={"sub": str(user_id), "type": "access"},
            expires_delta=expire_delta,
        )

    def create_refresh_token(self, user_id: UUID) -> tuple[str, int]:
        """Create JWT refresh token.

        Args:
            user_id: User ID to encode in token.

        Returns:
            tuple: Token string and expiration time in seconds.
        """
        expire_delta = JWTConfig.get_refresh_token_expire_time()
        return self._create_token(
            data={"sub": str(user_id), "type": "refresh"},
            expires_delta=expire_delta,
        )

    def create_email_verification_token(self, user_id: UUID) -> str:
        """Create email verification token.

        Args:
            user_id: User ID to encode in token.

        Returns:
            str: Token string.
        """
        expire_delta = JWTConfig.get_email_verification_token_expire_time()
        token, _ = self._create_token(
            data={"sub": str(user_id), "type": "email_verification"},
            expires_delta=expire_delta,
        )
        return token

    def create_password_reset_token(self, user_id: UUID) -> str:
        """Create password reset token.

        Args:
            user_id: User ID to encode in token.

        Returns:
            str: Token string.
        """
        expire_delta = JWTConfig.get_password_reset_token_expire_time()
        token, _ = self._create_token(
            data={"sub": str(user_id), "type": "password_reset"},
            expires_delta=expire_delta,
        )
        return token

    def verify_token(self, token: str, expected_type: str = "access") -> UUID:
        """Verify and decode JWT token.

        Args:
            token: JWT token to verify.
            expected_type: Expected token type (access, refresh, etc).

        Returns:
            UUID: User ID from token.

        Raises:
            InvalidTokenException: If token is invalid or expired.
        """
        try:
            payload = jwt.decode(
                token,
                JWTConfig.SECRET_KEY,
                algorithms=[JWTConfig.ALGORITHM],
            )

            user_id = payload.get("sub")
            token_type = payload.get("type")

            if not user_id:
                raise InvalidTokenException("Invalid token payload")

            if token_type != expected_type:
                raise InvalidTokenException(f"Invalid token type. Expected {expected_type}")

            try:
                return UUID(user_id)
            except ValueError:
                raise InvalidTokenException("Invalid user ID in token")

        except JWTError as e:
            logger.warning(f"Token verification failed: {str(e)}")
            raise InvalidTokenException()

    async def refresh_access_token(self, refresh_token: str) -> tuple[str, int]:
        """Refresh access token using refresh token.

        Args:
            refresh_token: Refresh token from client.

        Returns:
            tuple: New access token and expiration time in seconds.

        Raises:
            InvalidTokenException: If refresh token is invalid.
        """
        user_id = self.verify_token(refresh_token, expected_type="refresh")

        # Verify user exists and is active
        user = await self.user_repository.get_by_id(user_id)
        if not user or not user.is_active:
            raise InvalidTokenException("User not found or inactive")

        access_token, expires_in = self.create_access_token(user_id)
        logger.info(f"Access token refreshed for user: {user_id}")
        return access_token, expires_in

    async def verify_email(self, token: str) -> User:
        """Verify user email using verification token.

        Args:
            token: Email verification token.

        Returns:
            User: Updated user object.

        Raises:
            InvalidTokenException: If token is invalid.
        """
        user_id = self.verify_token(token, expected_type="email_verification")

        user = await self.user_repository.verify_email(user_id)
        if not user:
            raise InvalidTokenException("User not found")

        logger.info(f"Email verified for user: {user_id}")
        return user

    async def reset_password(self, token: str, new_password: str) -> User:
        """Reset user password using reset token.

        Args:
            token: Password reset token.
            new_password: New password (plain text).

        Returns:
            User: Updated user object.

        Raises:
            InvalidTokenException: If token is invalid.
        """
        user_id = self.verify_token(token, expected_type="password_reset")

        password_hash = SecurityUtils.hash_password(new_password)
        user = await self.user_repository.update_password(user_id, password_hash)

        if not user:
            raise InvalidTokenException("User not found")

        logger.info(f"Password reset for user: {user_id}")
        return user

    async def change_password(
        self, user_id: UUID, current_password: str, new_password: str
    ) -> User:
        """Change user password.

        Args:
            user_id: User ID.
            current_password: Current password (plain text).
            new_password: New password (plain text).

        Returns:
            User: Updated user object.

        Raises:
            InvalidCredentialsException: If current password is incorrect.
        """
        user = await self.user_repository.get_by_id(user_id)
        if not user or not SecurityUtils.verify_password(current_password, user.password_hash):
            raise InvalidCredentialsException()

        password_hash = SecurityUtils.hash_password(new_password)
        user = await self.user_repository.update_password(user_id, password_hash)

        logger.info(f"Password changed for user: {user_id}")
        return user

    def _create_token(self, data: dict, expires_delta: timedelta) -> tuple[str, int]:
        """Create JWT token.

        Args:
            data: Data to encode in token.
            expires_delta: Token expiration time delta.

        Returns:
            tuple: Token string and expiration time in seconds.
        """
        to_encode = data.copy()
        expire = datetime.now(UTC) + expires_delta
        to_encode.update({"exp": expire})

        encoded_jwt = jwt.encode(
            to_encode,
            JWTConfig.SECRET_KEY,
            algorithm=JWTConfig.ALGORITHM,
        )

        expires_in = int(expires_delta.total_seconds())
        return encoded_jwt, expires_in

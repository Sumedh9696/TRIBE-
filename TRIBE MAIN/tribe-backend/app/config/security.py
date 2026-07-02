"""Security configuration for JWT and password hashing."""

from passlib.context import CryptContext
from datetime import datetime, timedelta, UTC
from app.config.settings import settings

# Password hashing context
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


class SecurityUtils:
    """Utilities for security operations."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt.

        Args:
            password: Plain text password to hash.

        Returns:
            str: Hashed password.
        """
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against a hashed password.

        Args:
            plain_password: Plain text password to verify.
            hashed_password: Hashed password to compare against.

        Returns:
            bool: True if password matches, False otherwise.
        """
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Get the hash of a password (alias for hash_password).

        Args:
            password: Plain text password to hash.

        Returns:
            str: Hashed password.
        """
        return SecurityUtils.hash_password(password)


class JWTConfig:
    """JWT configuration and utilities."""

    SECRET_KEY = settings.SECRET_KEY
    ALGORITHM = settings.ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS
    EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS = (
        settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS
    )
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS = settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS

    @staticmethod
    def get_access_token_expire_time() -> timedelta:
        """Get access token expiration time.

        Returns:
            timedelta: Time delta for token expiration.
        """
        return timedelta(minutes=JWTConfig.ACCESS_TOKEN_EXPIRE_MINUTES)

    @staticmethod
    def get_refresh_token_expire_time() -> timedelta:
        """Get refresh token expiration time.

        Returns:
            timedelta: Time delta for token expiration.
        """
        return timedelta(days=JWTConfig.REFRESH_TOKEN_EXPIRE_DAYS)

    @staticmethod
    def get_email_verification_token_expire_time() -> timedelta:
        """Get email verification token expiration time.

        Returns:
            timedelta: Time delta for token expiration.
        """
        return timedelta(hours=JWTConfig.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS)

    @staticmethod
    def get_password_reset_token_expire_time() -> timedelta:
        """Get password reset token expiration time.

        Returns:
            timedelta: Time delta for token expiration.
        """
        return timedelta(hours=JWTConfig.PASSWORD_RESET_TOKEN_EXPIRE_HOURS)

    @staticmethod
    def get_token_expire_datetime(
        delta: timedelta,
    ) -> datetime:
        """Get token expiration datetime.

        Args:
            delta: Time delta to add to current time.

        Returns:
            datetime: Expiration datetime.
        """
        return datetime.now(UTC) + delta

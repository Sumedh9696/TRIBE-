"""Authentication dependencies for FastAPI."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.database import get_db
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.core.exceptions import (
    InvalidTokenException,
    AuthenticationException,
    AccountInactiveException,
)
from uuid import UUID
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get current authenticated user from JWT token.

    Args:
        credentials: HTTP Bearer credentials.
        db: Database session.

    Returns:
        User: Current authenticated user.

    Raises:
        HTTPException: If authentication fails.
    """
    token = credentials.credentials

    try:
        # Create repositories and services
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        # Verify token and get user ID
        user_id = auth_service.verify_token(token, expected_type="access")

        # Get user from database
        user = await user_repo.get_by_id(user_id)

        if not user:
            raise AuthenticationException("User not found")

        if not user.is_active:
            raise AccountInactiveException()

        return user

    except InvalidTokenException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (AuthenticationException, AccountInactiveException) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.message,
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_verified_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get current user and verify email is verified.

    Args:
        current_user: Current authenticated user.

    Returns:
        User: Current user with verified email.

    Raises:
        HTTPException: If email is not verified.
    """
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified",
        )
    return current_user


async def get_optional_user(
    credentials: HTTPAuthCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Get current user if authenticated, otherwise return None.

    Args:
        credentials: HTTP Bearer credentials.
        db: Database session.

    Returns:
        User | None: Current user if authenticated, None otherwise.
    """
    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None

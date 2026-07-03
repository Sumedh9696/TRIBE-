"""Role-based access control dependencies."""

from fastapi import Depends, HTTPException, status
from app.models.user import User
from app.api.dependencies.auth import get_current_user
from typing import Optional


def require_role(*allowed_roles: str):
    """Create a dependency that requires specific roles.

    Args:
        *allowed_roles: List of allowed roles.

    Returns:
        Callable: Dependency function.
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        """Check if user has required role.

        Args:
            current_user: Current authenticated user.

        Returns:
            User: Current user if has required role.

        Raises:
            HTTPException: If user doesn't have required role.
        """
        if not current_user.role or current_user.role.name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This action requires one of these roles: {', '.join(allowed_roles)}",
            )
        return current_user

    return role_checker


async def require_admin(current_user: User = Depends(require_role("admin"))) -> User:
    """Dependency that requires admin role.

    Args:
        current_user: Current user with admin role.

    Returns:
        User: Current admin user.
    """
    return current_user


async def require_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that requires user role (or higher).

    Args:
        current_user: Current authenticated user.

    Returns:
        User: Current user.
    """
    return current_user

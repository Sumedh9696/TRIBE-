"""User service."""

from typing import Optional
from uuid import UUID
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.core.exceptions import ResourceNotFoundException, ConflictException
import logging

logger = logging.getLogger(__name__)


class UserService:
    """Service for user operations."""

    def __init__(self, user_repository: UserRepository):
        """Initialize user service.

        Args:
            user_repository: User repository instance.
        """
        self.user_repository = user_repository

    async def get_user(self, user_id: UUID) -> User:
        """Get user by ID.

        Args:
            user_id: User ID.

        Returns:
            User: User object.

        Raises:
            ResourceNotFoundException: If user not found.
        """
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))
        return user

    async def get_user_by_email(self, email: str) -> User:
        """Get user by email.

        Args:
            email: User email.

        Returns:
            User: User object.

        Raises:
            ResourceNotFoundException: If user not found.
        """
        user = await self.user_repository.get_by_email(email)
        if not user:
            raise ResourceNotFoundException("User", email)
        return user

    async def update_user(
        self, user_id: UUID, email: Optional[str] = None, username: Optional[str] = None
    ) -> User:
        """Update user.

        Args:
            user_id: User ID.
            email: New email (optional).
            username: New username (optional).

        Returns:
            User: Updated user object.

        Raises:
            ResourceNotFoundException: If user not found.
            ConflictException: If email or username already exists.
        """
        # Check if user exists
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))

        # Check if new email or username already exists
        if email and email != user.email:
            existing_user = await self.user_repository.get_by_email(email)
            if existing_user:
                raise ConflictException("Email already exists")

        if username and username != user.username:
            existing_user = await self.user_repository.get_by_username(username)
            if existing_user:
                raise ConflictException("Username already exists")

        # Update user
        updated_user = await self.user_repository.update(user_id, email, username)
        logger.info(f"User updated: {user_id}")
        return updated_user

    async def deactivate_user(self, user_id: UUID) -> User:
        """Deactivate user account.

        Args:
            user_id: User ID.

        Returns:
            User: Updated user object.

        Raises:
            ResourceNotFoundException: If user not found.
        """
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))

        updated_user = await self.user_repository.deactivate(user_id)
        logger.info(f"User deactivated: {user_id}")
        return updated_user

    async def activate_user(self, user_id: UUID) -> User:
        """Activate user account.

        Args:
            user_id: User ID.

        Returns:
            User: Updated user object.

        Raises:
            ResourceNotFoundException: If user not found.
        """
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))

        updated_user = await self.user_repository.activate(user_id)
        logger.info(f"User activated: {user_id}")
        return updated_user

    async def list_users(self, skip: int = 0, limit: int = 20) -> tuple[list[User], int]:
        """List all users.

        Args:
            skip: Number of records to skip.
            limit: Number of records to return.

        Returns:
            tuple: List of users and total count.
        """
        return await self.user_repository.list_all(skip, limit)

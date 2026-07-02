"""User repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.user import User
from app.models.profile import Profile
from typing import Optional
from uuid import UUID


class UserRepository:
    """Repository for user database operations."""

    def __init__(self, session: AsyncSession):
        """Initialize repository.

        Args:
            session: AsyncSession for database operations.
        """
        self.session = session

    async def create(self, email: str, username: str, password_hash: str) -> User:
        """Create a new user.

        Args:
            email: User email.
            username: User username.
            password_hash: Hashed password.

        Returns:
            User: Created user object.
        """
        user = User(email=email, username=username, password_hash=password_hash)
        self.session.add(user)
        await self.session.flush()
        return user

    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID.

        Args:
            user_id: User ID.

        Returns:
            Optional[User]: User if found, None otherwise.
        """
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email.

        Args:
            email: User email.

        Returns:
            Optional[User]: User if found, None otherwise.
        """
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalars().first()

    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username.

        Args:
            username: User username.

        Returns:
            Optional[User]: User if found, None otherwise.
        """
        result = await self.session.execute(
            select(User).where(User.username == username)
        )
        return result.scalars().first()

    async def update(
        self, user_id: UUID, email: Optional[str] = None, username: Optional[str] = None
    ) -> Optional[User]:
        """Update user.

        Args:
            user_id: User ID.
            email: New email (optional).
            username: New username (optional).

        Returns:
            Optional[User]: Updated user if found, None otherwise.
        """
        user = await self.get_by_id(user_id)
        if not user:
            return None

        if email:
            user.email = email
        if username:
            user.username = username

        await self.session.flush()
        return user

    async def verify_email(self, user_id: UUID) -> Optional[User]:
        """Mark user email as verified.

        Args:
            user_id: User ID.

        Returns:
            Optional[User]: Updated user if found, None otherwise.
        """
        user = await self.get_by_id(user_id)
        if user:
            user.is_verified = True
            await self.session.flush()
        return user

    async def deactivate(self, user_id: UUID) -> Optional[User]:
        """Deactivate user account.

        Args:
            user_id: User ID.

        Returns:
            Optional[User]: Updated user if found, None otherwise.
        """
        user = await self.get_by_id(user_id)
        if user:
            user.is_active = False
            await self.session.flush()
        return user

    async def activate(self, user_id: UUID) -> Optional[User]:
        """Activate user account.

        Args:
            user_id: User ID.

        Returns:
            Optional[User]: Updated user if found, None otherwise.
        """
        user = await self.get_by_id(user_id)
        if user:
            user.is_active = True
            await self.session.flush()
        return user

    async def update_password(self, user_id: UUID, password_hash: str) -> Optional[User]:
        """Update user password.

        Args:
            user_id: User ID.
            password_hash: New hashed password.

        Returns:
            Optional[User]: Updated user if found, None otherwise.
        """
        user = await self.get_by_id(user_id)
        if user:
            user.password_hash = password_hash
            await self.session.flush()
        return user

    async def list_all(self, skip: int = 0, limit: int = 20) -> tuple[list[User], int]:
        """List all users with pagination.

        Args:
            skip: Number of records to skip.
            limit: Number of records to return.

        Returns:
            tuple: List of users and total count.
        """
        # Get total count
        count_result = await self.session.execute(select(func.count(User.id)))
        total = count_result.scalar() or 0

        # Get paginated results
        result = await self.session.execute(
            select(User).offset(skip).limit(limit)
        )
        users = result.scalars().all()

        return users, total

    async def exists(self, email: str = None, username: str = None) -> bool:
        """Check if user exists by email or username.

        Args:
            email: User email to check.
            username: User username to check.

        Returns:
            bool: True if user exists, False otherwise.
        """
        if email:
            result = await self.session.execute(
                select(func.count(User.id)).where(User.email == email)
            )
            if (result.scalar() or 0) > 0:
                return True

        if username:
            result = await self.session.execute(
                select(func.count(User.id)).where(User.username == username)
            )
            if (result.scalar() or 0) > 0:
                return True

        return False

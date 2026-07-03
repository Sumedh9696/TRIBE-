"""Interest repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.interest import Interest
from app.models.user_interest import UserInterest
from typing import Optional
from uuid import UUID


class InterestRepository:
    """Repository for interest database operations."""

    def __init__(self, session: AsyncSession):
        """Initialize repository.

        Args:
            session: AsyncSession for database operations.
        """
        self.session = session

    async def create(
        self,
        name: str,
        category: str,
        description: Optional[str] = None,
    ) -> Interest:
        """Create a new interest.

        Args:
            name: Interest name.
            category: Interest category.
            description: Description (optional).

        Returns:
            Interest: Created interest object.
        """
        interest = Interest(
            name=name,
            category=category,
            description=description,
        )
        self.session.add(interest)
        await self.session.flush()
        return interest

    async def get_by_id(self, interest_id: UUID) -> Optional[Interest]:
        """Get interest by ID.

        Args:
            interest_id: Interest ID.

        Returns:
            Optional[Interest]: Interest if found, None otherwise.
        """
        result = await self.session.execute(
            select(Interest).where(Interest.id == interest_id)
        )
        return result.scalars().first()

    async def get_by_name(self, name: str) -> Optional[Interest]:
        """Get interest by name.

        Args:
            name: Interest name.

        Returns:
            Optional[Interest]: Interest if found, None otherwise.
        """
        result = await self.session.execute(
            select(Interest).where(Interest.name == name)
        )
        return result.scalars().first()

    async def list_all(self, skip: int = 0, limit: int = 20) -> tuple[list[Interest], int]:
        """List all interests with pagination.

        Args:
            skip: Number of records to skip.
            limit: Number of records to return.

        Returns:
            tuple: List of interests and total count.
        """
        # Get total count
        count_result = await self.session.execute(select(func.count(Interest.id)))
        total = count_result.scalar() or 0

        # Get paginated results
        result = await self.session.execute(
            select(Interest).offset(skip).limit(limit)
        )
        interests = result.scalars().all()

        return interests, total

    async def list_by_category(
        self, category: str, skip: int = 0, limit: int = 20
    ) -> tuple[list[Interest], int]:
        """List interests by category.

        Args:
            category: Interest category.
            skip: Number of records to skip.
            limit: Number of records to return.

        Returns:
            tuple: List of interests and total count.
        """
        # Get total count
        count_result = await self.session.execute(
            select(func.count(Interest.id)).where(Interest.category == category)
        )
        total = count_result.scalar() or 0

        # Get paginated results
        result = await self.session.execute(
            select(Interest)
            .where(Interest.category == category)
            .offset(skip)
            .limit(limit)
        )
        interests = result.scalars().all()

        return interests, total

    async def add_to_user(self, user_id: UUID, interest_id: UUID) -> UserInterest:
        """Add interest to user.

        Args:
            user_id: User ID.
            interest_id: Interest ID.

        Returns:
            UserInterest: Created user interest object.
        """
        user_interest = UserInterest(user_id=user_id, interest_id=interest_id)
        self.session.add(user_interest)
        await self.session.flush()
        return user_interest

    async def remove_from_user(self, user_id: UUID, interest_id: UUID) -> bool:
        """Remove interest from user.

        Args:
            user_id: User ID.
            interest_id: Interest ID.

        Returns:
            bool: True if removed, False if not found.
        """
        result = await self.session.execute(
            select(UserInterest).where(
                (UserInterest.user_id == user_id)
                & (UserInterest.interest_id == interest_id)
            )
        )
        user_interest = result.scalars().first()

        if not user_interest:
            return False

        await self.session.delete(user_interest)
        await self.session.flush()
        return True

    async def get_user_interests(
        self, user_id: UUID, skip: int = 0, limit: int = 20
    ) -> tuple[list[Interest], int]:
        """Get user's interests.

        Args:
            user_id: User ID.
            skip: Number of records to skip.
            limit: Number of records to return.

        Returns:
            tuple: List of interests and total count.
        """
        # Get total count
        count_result = await self.session.execute(
            select(func.count(UserInterest.id)).where(UserInterest.user_id == user_id)
        )
        total = count_result.scalar() or 0

        # Get paginated results
        result = await self.session.execute(
            select(Interest)
            .join(UserInterest, Interest.id == UserInterest.interest_id)
            .where(UserInterest.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        interests = result.scalars().all()

        return interests, total

    async def remove_all_from_user(self, user_id: UUID) -> int:
        """Remove all interests from user.

        Args:
            user_id: User ID.

        Returns:
            int: Number of interests removed.
        """
        result = await self.session.execute(
            select(UserInterest).where(UserInterest.user_id == user_id)
        )
        user_interests = result.scalars().all()

        for ui in user_interests:
            await self.session.delete(ui)

        await self.session.flush()
        return len(user_interests)

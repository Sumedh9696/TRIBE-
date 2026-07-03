"""Interest service."""

from typing import Optional
from uuid import UUID
from app.repositories.interest_repository import InterestRepository
from app.repositories.user_repository import UserRepository
from app.models.interest import Interest
from app.core.exceptions import ResourceNotFoundException, ConflictException
import logging

logger = logging.getLogger(__name__)


class InterestService:
    """Service for interest operations."""

    def __init__(
        self,
        interest_repository: InterestRepository,
        user_repository: UserRepository,
    ):
        """Initialize interest service.

        Args:
            interest_repository: Interest repository instance.
            user_repository: User repository instance.
        """
        self.interest_repository = interest_repository
        self.user_repository = user_repository

    async def create_interest(
        self,
        name: str,
        category: str,
        description: Optional[str] = None,
    ) -> Interest:
        """Create interest.

        Args:
            name: Interest name.
            category: Interest category.
            description: Description (optional).

        Returns:
            Interest: Created interest object.

        Raises:
            ConflictException: If interest with same name already exists.
        """
        # Check if interest already exists
        existing = await self.interest_repository.get_by_name(name)
        if existing:
            raise ConflictException(f"Interest '{name}' already exists")

        interest = await self.interest_repository.create(
            name=name,
            category=category,
            description=description,
        )

        logger.info(f"Interest created: {name}")
        return interest

    async def get_interest(self, interest_id: UUID) -> Interest:
        """Get interest by ID.

        Args:
            interest_id: Interest ID.

        Returns:
            Interest: Interest object.

        Raises:
            ResourceNotFoundException: If interest not found.
        """
        interest = await self.interest_repository.get_by_id(interest_id)
        if not interest:
            raise ResourceNotFoundException("Interest", str(interest_id))
        return interest

    async def list_interests(
        self, skip: int = 0, limit: int = 20
    ) -> tuple[list[Interest], int]:
        """List all interests.

        Args:
            skip: Number of records to skip.
            limit: Number of records to return.

        Returns:
            tuple: List of interests and total count.
        """
        return await self.interest_repository.list_all(skip, limit)

    async def list_interests_by_category(
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
        return await self.interest_repository.list_by_category(category, skip, limit)

    async def add_interests_to_user(
        self, user_id: UUID, interest_ids: list[UUID]
    ) -> list[Interest]:
        """Add interests to user.

        Args:
            user_id: User ID.
            interest_ids: List of interest IDs to add.

        Returns:
            list: List of added interests.

        Raises:
            ResourceNotFoundException: If user or interest not found.
        """
        # Verify user exists
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))

        added_interests = []
        for interest_id in interest_ids:
            # Verify interest exists
            interest = await self.interest_repository.get_by_id(interest_id)
            if not interest:
                raise ResourceNotFoundException("Interest", str(interest_id))

            # Add interest to user
            await self.interest_repository.add_to_user(user_id, interest_id)
            added_interests.append(interest)

        logger.info(f"Added {len(interest_ids)} interests to user: {user_id}")
        return added_interests

    async def remove_interest_from_user(self, user_id: UUID, interest_id: UUID) -> bool:
        """Remove interest from user.

        Args:
            user_id: User ID.
            interest_id: Interest ID.

        Returns:
            bool: True if removed.

        Raises:
            ResourceNotFoundException: If user not found.
        """
        # Verify user exists
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))

        result = await self.interest_repository.remove_from_user(user_id, interest_id)
        if result:
            logger.info(f"Removed interest from user: {user_id}")
        return result

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

        Raises:
            ResourceNotFoundException: If user not found.
        """
        # Verify user exists
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))

        return await self.interest_repository.get_user_interests(user_id, skip, limit)

    async def set_user_interests(
        self, user_id: UUID, interest_ids: list[UUID]
    ) -> list[Interest]:
        """Replace user's interests with new list.

        Args:
            user_id: User ID.
            interest_ids: List of new interest IDs.

        Returns:
            list: List of new interests.

        Raises:
            ResourceNotFoundException: If user not found.
        """
        # Verify user exists
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))

        # Remove all existing interests
        await self.interest_repository.remove_all_from_user(user_id)

        # Add new interests
        return await self.add_interests_to_user(user_id, interest_ids)

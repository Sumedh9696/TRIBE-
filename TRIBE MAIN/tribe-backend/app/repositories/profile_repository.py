"""Profile repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.profile import Profile
from typing import Optional
from uuid import UUID


class ProfileRepository:
    """Repository for profile database operations."""

    def __init__(self, session: AsyncSession):
        """Initialize repository.

        Args:
            session: AsyncSession for database operations.
        """
        self.session = session

    async def create(
        self,
        user_id: UUID,
        first_name: str,
        last_name: str,
        bio: Optional[str] = None,
        age_range: Optional[str] = None,
        city: Optional[str] = None,
        country: Optional[str] = None,
    ) -> Profile:
        """Create a new profile.

        Args:
            user_id: User ID.
            first_name: First name.
            last_name: Last name.
            bio: Bio (optional).
            age_range: Age range (optional).
            city: City (optional).
            country: Country (optional).

        Returns:
            Profile: Created profile object.
        """
        profile = Profile(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name,
            bio=bio,
            age_range=age_range,
            city=city,
            country=country,
        )
        self.session.add(profile)
        await self.session.flush()
        return profile

    async def get_by_id(self, profile_id: UUID) -> Optional[Profile]:
        """Get profile by ID.

        Args:
            profile_id: Profile ID.

        Returns:
            Optional[Profile]: Profile if found, None otherwise.
        """
        result = await self.session.execute(
            select(Profile).where(Profile.id == profile_id)
        )
        return result.scalars().first()

    async def get_by_user_id(self, user_id: UUID) -> Optional[Profile]:
        """Get profile by user ID.

        Args:
            user_id: User ID.

        Returns:
            Optional[Profile]: Profile if found, None otherwise.
        """
        result = await self.session.execute(
            select(Profile).where(Profile.user_id == user_id)
        )
        return result.scalars().first()

    async def update(
        self,
        profile_id: UUID,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        bio: Optional[str] = None,
        profile_photo: Optional[str] = None,
        age_range: Optional[str] = None,
        city: Optional[str] = None,
        country: Optional[str] = None,
    ) -> Optional[Profile]:
        """Update profile.

        Args:
            profile_id: Profile ID.
            first_name: First name (optional).
            last_name: Last name (optional).
            bio: Bio (optional).
            profile_photo: Profile photo URL (optional).
            age_range: Age range (optional).
            city: City (optional).
            country: Country (optional).

        Returns:
            Optional[Profile]: Updated profile if found, None otherwise.
        """
        profile = await self.get_by_id(profile_id)
        if not profile:
            return None

        if first_name is not None:
            profile.first_name = first_name
        if last_name is not None:
            profile.last_name = last_name
        if bio is not None:
            profile.bio = bio
        if profile_photo is not None:
            profile.profile_photo = profile_photo
        if age_range is not None:
            profile.age_range = age_range
        if city is not None:
            profile.city = city
        if country is not None:
            profile.country = country

        await self.session.flush()
        return profile

    async def delete(self, profile_id: UUID) -> bool:
        """Delete profile.

        Args:
            profile_id: Profile ID.

        Returns:
            bool: True if deleted, False if not found.
        """
        profile = await self.get_by_id(profile_id)
        if not profile:
            return False

        await self.session.delete(profile)
        await self.session.flush()
        return True

    async def list_all(self, skip: int = 0, limit: int = 20) -> tuple[list[Profile], int]:
        """List all profiles with pagination.

        Args:
            skip: Number of records to skip.
            limit: Number of records to return.

        Returns:
            tuple: List of profiles and total count.
        """
        # Get total count
        count_result = await self.session.execute(select(func.count(Profile.id)))
        total = count_result.scalar() or 0

        # Get paginated results
        result = await self.session.execute(
            select(Profile).offset(skip).limit(limit)
        )
        profiles = result.scalars().all()

        return profiles, total

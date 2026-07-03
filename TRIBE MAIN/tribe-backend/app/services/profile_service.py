"""Profile service."""

from typing import Optional
from uuid import UUID
from app.repositories.profile_repository import ProfileRepository
from app.repositories.user_repository import UserRepository
from app.models.profile import Profile
from app.core.exceptions import ResourceNotFoundException
import logging

logger = logging.getLogger(__name__)


class ProfileService:
    """Service for profile operations."""

    def __init__(
        self,
        profile_repository: ProfileRepository,
        user_repository: UserRepository,
    ):
        """Initialize profile service.

        Args:
            profile_repository: Profile repository instance.
            user_repository: User repository instance.
        """
        self.profile_repository = profile_repository
        self.user_repository = user_repository

    async def create_profile(
        self,
        user_id: UUID,
        first_name: str,
        last_name: str,
        bio: Optional[str] = None,
        age_range: Optional[str] = None,
        city: Optional[str] = None,
        country: Optional[str] = None,
    ) -> Profile:
        """Create user profile.

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

        Raises:
            ResourceNotFoundException: If user not found.
        """
        # Verify user exists
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User", str(user_id))

        profile = await self.profile_repository.create(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name,
            bio=bio,
            age_range=age_range,
            city=city,
            country=country,
        )

        logger.info(f"Profile created for user: {user_id}")
        return profile

    async def get_profile(self, profile_id: UUID) -> Profile:
        """Get profile by ID.

        Args:
            profile_id: Profile ID.

        Returns:
            Profile: Profile object.

        Raises:
            ResourceNotFoundException: If profile not found.
        """
        profile = await self.profile_repository.get_by_id(profile_id)
        if not profile:
            raise ResourceNotFoundException("Profile", str(profile_id))
        return profile

    async def get_profile_by_user_id(self, user_id: UUID) -> Profile:
        """Get profile by user ID.

        Args:
            user_id: User ID.

        Returns:
            Profile: Profile object.

        Raises:
            ResourceNotFoundException: If profile not found.
        """
        profile = await self.profile_repository.get_by_user_id(user_id)
        if not profile:
            raise ResourceNotFoundException("Profile for user", str(user_id))
        return profile

    async def update_profile(
        self,
        profile_id: UUID,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        bio: Optional[str] = None,
        profile_photo: Optional[str] = None,
        age_range: Optional[str] = None,
        city: Optional[str] = None,
        country: Optional[str] = None,
    ) -> Profile:
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
            Profile: Updated profile object.

        Raises:
            ResourceNotFoundException: If profile not found.
        """
        profile = await self.profile_repository.get_by_id(profile_id)
        if not profile:
            raise ResourceNotFoundException("Profile", str(profile_id))

        updated_profile = await self.profile_repository.update(
            profile_id=profile_id,
            first_name=first_name,
            last_name=last_name,
            bio=bio,
            profile_photo=profile_photo,
            age_range=age_range,
            city=city,
            country=country,
        )

        logger.info(f"Profile updated: {profile_id}")
        return updated_profile

    async def delete_profile(self, profile_id: UUID) -> bool:
        """Delete profile.

        Args:
            profile_id: Profile ID.

        Returns:
            bool: True if deleted.

        Raises:
            ResourceNotFoundException: If profile not found.
        """
        profile = await self.profile_repository.get_by_id(profile_id)
        if not profile:
            raise ResourceNotFoundException("Profile", str(profile_id))

        result = await self.profile_repository.delete(profile_id)
        logger.info(f"Profile deleted: {profile_id}")
        return result

    async def list_profiles(self, skip: int = 0, limit: int = 20) -> tuple[list[Profile], int]:
        """List all profiles.

        Args:
            skip: Number of records to skip.
            limit: Number of records to return.

        Returns:
            tuple: List of profiles and total count.
        """
        return await self.profile_repository.list_all(skip, limit)

"""Profile API endpoints."""

from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.config.database import get_db
from app.repositories.profile_repository import ProfileRepository
from app.repositories.user_repository import UserRepository
from app.services.profile_service import ProfileService
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.core.responses import Response, PaginatedResponse, PaginationMeta, MessageResponse
from app.core.exceptions import TribeException, ResourceNotFoundException
from app.api.dependencies.auth import get_current_verified_user
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/profiles", tags=["Profiles"])


@router.post(
    "",
    response_model=Response[ProfileResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create user profile",
    responses={409: {"description": "Profile already exists"}},
)
async def create_profile(
    request: ProfileCreate,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> Response[ProfileResponse]:
    """Create profile for current user.

    Args:
        request: Profile creation request.
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        Response: Response with created profile data.
    """
    try:
        profile_repo = ProfileRepository(db)
        user_repo = UserRepository(db)
        profile_service = ProfileService(profile_repo, user_repo)

        # Check if profile already exists
        existing_profile = await profile_repo.get_by_user_id(current_user.id)
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Profile already exists for this user",
            )

        profile = await profile_service.create_profile(
            user_id=current_user.id,
            first_name=request.first_name,
            last_name=request.last_name,
            bio=request.bio,
            age_range=request.age_range,
            city=request.city,
            country=request.country,
        )

        await db.commit()

        return Response(
            success=True,
            message="Profile created successfully",
            data=ProfileResponse.model_validate(profile),
        )

    except HTTPException:
        await db.rollback()
        raise
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Profile creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile creation failed",
        )


@router.get(
    "/me",
    response_model=Response[ProfileResponse],
    summary="Get current user profile",
    responses={404: {"description": "Profile not found"}},
)
async def get_my_profile(
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> Response[ProfileResponse]:
    """Get current user's profile.

    Args:
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        Response: Response with profile data.
    """
    try:
        profile_repo = ProfileRepository(db)
        user_repo = UserRepository(db)
        profile_service = ProfileService(profile_repo, user_repo)

        profile = await profile_service.get_profile_by_user_id(current_user.id)

        return Response(
            success=True,
            message="Profile retrieved",
            data=ProfileResponse.model_validate(profile),
        )

    except ResourceNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get(
    "/{profile_id}",
    response_model=Response[ProfileResponse],
    summary="Get profile by ID",
    responses={404: {"description": "Profile not found"}},
)
async def get_profile(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> Response[ProfileResponse]:
    """Get profile by ID.

    Args:
        profile_id: Profile ID as string.
        db: Database session.
        current_user: Current authenticated user.

    Returns:
        Response: Response with profile data.
    """
    try:
        profile_uuid = UUID(profile_id)
        profile_repo = ProfileRepository(db)
        user_repo = UserRepository(db)
        profile_service = ProfileService(profile_repo, user_repo)

        profile = await profile_service.get_profile(profile_uuid)

        return Response(
            success=True,
            message="Profile retrieved",
            data=ProfileResponse.model_validate(profile),
        )

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid profile ID")
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put(
    "/me",
    response_model=Response[ProfileResponse],
    summary="Update current user profile",
    responses={404: {"description": "Profile not found"}},
)
async def update_my_profile(
    request: ProfileUpdate,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> Response[ProfileResponse]:
    """Update current user's profile.

    Args:
        request: Profile update request.
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        Response: Response with updated profile data.
    """
    try:
        profile_repo = ProfileRepository(db)
        user_repo = UserRepository(db)
        profile_service = ProfileService(profile_repo, user_repo)

        # Get current profile
        profile = await profile_service.get_profile_by_user_id(current_user.id)

        # Update profile
        updated_profile = await profile_service.update_profile(
            profile_id=profile.id,
            first_name=request.first_name,
            last_name=request.last_name,
            bio=request.bio,
            profile_photo=request.profile_photo,
            age_range=request.age_range,
            city=request.city,
            country=request.country,
        )

        await db.commit()

        return Response(
            success=True,
            message="Profile updated successfully",
            data=ProfileResponse.model_validate(updated_profile),
        )

    except ResourceNotFoundException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Profile update error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile update failed",
        )


@router.delete(
    "/me",
    response_model=MessageResponse,
    summary="Delete current user profile",
    responses={404: {"description": "Profile not found"}},
)
async def delete_my_profile(
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Delete current user's profile.

    Args:
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        MessageResponse: Success message.
    """
    try:
        profile_repo = ProfileRepository(db)
        user_repo = UserRepository(db)
        profile_service = ProfileService(profile_repo, user_repo)

        # Get current profile
        profile = await profile_service.get_profile_by_user_id(current_user.id)

        # Delete profile
        await profile_service.delete_profile(profile.id)
        await db.commit()

        return MessageResponse(
            success=True,
            message="Profile deleted successfully",
        )

    except ResourceNotFoundException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Profile deletion error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile deletion failed",
        )


@router.get(
    "",
    response_model=PaginatedResponse[ProfileResponse],
    summary="List profiles",
)
async def list_profiles(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Page size"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> PaginatedResponse[ProfileResponse]:
    """List all profiles with pagination.

    Args:
        page: Page number (1-indexed).
        page_size: Number of items per page.
        db: Database session.
        current_user: Current authenticated user.

    Returns:
        PaginatedResponse: Response with paginated profile list.
    """
    try:
        profile_repo = ProfileRepository(db)
        user_repo = UserRepository(db)
        profile_service = ProfileService(profile_repo, user_repo)

        skip = (page - 1) * page_size
        profiles, total = await profile_service.list_profiles(skip, page_size)

        total_pages = (total + page_size - 1) // page_size

        return PaginatedResponse(
            success=True,
            data=[ProfileResponse.model_validate(profile) for profile in profiles],
            meta=PaginationMeta(
                page=page,
                page_size=page_size,
                total_items=total,
                total_pages=total_pages,
                has_next=page < total_pages,
                has_previous=page > 1,
            ),
        )

    except Exception as e:
        logger.error(f"List profiles error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list profiles",
        )

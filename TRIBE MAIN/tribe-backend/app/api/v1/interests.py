"""Interest API endpoints."""

from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.config.database import get_db
from app.repositories.interest_repository import InterestRepository
from app.repositories.user_repository import UserRepository
from app.services.interest_service import InterestService
from app.schemas.interest import (
    InterestCreate,
    InterestResponse,
    UserInterestRequest,
)
from app.core.responses import Response, PaginatedResponse, PaginationMeta, MessageResponse
from app.core.exceptions import TribeException, ResourceNotFoundException
from app.api.dependencies.auth import get_current_verified_user
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/interests", tags=["Interests"])


@router.post(
    "",
    response_model=Response[InterestResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create interest (Admin only)",
    responses={
        403: {"description": "Insufficient permissions"},
        409: {"description": "Interest already exists"},
    },
)
async def create_interest(
    request: InterestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> Response[InterestResponse]:
    """Create a new interest. Admin only.

    Args:
        request: Interest creation request.
        db: Database session.
        current_user: Current authenticated user.

    Returns:
        Response: Response with created interest data.
    """
    try:
        # Check if user is admin
        if not current_user.role or current_user.role.name != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can create interests",
            )

        interest_repo = InterestRepository(db)
        user_repo = UserRepository(db)
        interest_service = InterestService(interest_repo, user_repo)

        interest = await interest_service.create_interest(
            name=request.name,
            category=request.category,
            description=request.description,
        )

        await db.commit()

        return Response(
            success=True,
            message="Interest created successfully",
            data=InterestResponse.model_validate(interest),
        )

    except HTTPException:
        await db.rollback()
        raise
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Interest creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Interest creation failed",
        )


@router.get(
    "/{interest_id}",
    response_model=Response[InterestResponse],
    summary="Get interest by ID",
    responses={404: {"description": "Interest not found"}},
)
async def get_interest(
    interest_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> Response[InterestResponse]:
    """Get interest by ID.

    Args:
        interest_id: Interest ID as string.
        db: Database session.
        current_user: Current authenticated user.

    Returns:
        Response: Response with interest data.
    """
    try:
        interest_uuid = UUID(interest_id)
        interest_repo = InterestRepository(db)
        user_repo = UserRepository(db)
        interest_service = InterestService(interest_repo, user_repo)

        interest = await interest_service.get_interest(interest_uuid)

        return Response(
            success=True,
            message="Interest retrieved",
            data=InterestResponse.model_validate(interest),
        )

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid interest ID")
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get(
    "",
    response_model=PaginatedResponse[InterestResponse],
    summary="List interests",
)
async def list_interests(
    category: str = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Page size"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> PaginatedResponse[InterestResponse]:
    """List interests with optional category filter.

    Args:
        category: Optional category filter.
        page: Page number (1-indexed).
        page_size: Number of items per page.
        db: Database session.
        current_user: Current authenticated user.

    Returns:
        PaginatedResponse: Response with paginated interest list.
    """
    try:
        interest_repo = InterestRepository(db)
        user_repo = UserRepository(db)
        interest_service = InterestService(interest_repo, user_repo)

        skip = (page - 1) * page_size

        if category:
            interests, total = await interest_service.list_interests_by_category(
                category, skip, page_size
            )
        else:
            interests, total = await interest_service.list_interests(skip, page_size)

        total_pages = (total + page_size - 1) // page_size

        return PaginatedResponse(
            success=True,
            data=[InterestResponse.model_validate(interest) for interest in interests],
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
        logger.error(f"List interests error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list interests",
        )


@router.post(
    "/user/interests",
    response_model=Response[list[InterestResponse]],
    summary="Add interests to current user",
    responses={404: {"description": "User or interest not found"}},
)
async def add_user_interests(
    request: UserInterestRequest,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> Response[list[InterestResponse]]:
    """Add interests to current user.

    Args:
        request: Request with list of interest IDs.
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        Response: Response with added interests.
    """
    try:
        interest_repo = InterestRepository(db)
        user_repo = UserRepository(db)
        interest_service = InterestService(interest_repo, user_repo)

        interests = await interest_service.add_interests_to_user(
            current_user.id, request.interest_ids
        )

        await db.commit()

        return Response(
            success=True,
            message="Interests added successfully",
            data=[InterestResponse.model_validate(interest) for interest in interests],
        )

    except ResourceNotFoundException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Add interests error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add interests",
        )


@router.get(
    "/user/interests",
    response_model=PaginatedResponse[InterestResponse],
    summary="Get current user interests",
)
async def get_user_interests(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Page size"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> PaginatedResponse[InterestResponse]:
    """Get current user's interests.

    Args:
        page: Page number (1-indexed).
        page_size: Number of items per page.
        db: Database session.
        current_user: Current authenticated user.

    Returns:
        PaginatedResponse: Response with paginated user interests.
    """
    try:
        interest_repo = InterestRepository(db)
        user_repo = UserRepository(db)
        interest_service = InterestService(interest_repo, user_repo)

        skip = (page - 1) * page_size
        interests, total = await interest_service.get_user_interests(
            current_user.id, skip, page_size
        )

        total_pages = (total + page_size - 1) // page_size

        return PaginatedResponse(
            success=True,
            data=[InterestResponse.model_validate(interest) for interest in interests],
            meta=PaginationMeta(
                page=page,
                page_size=page_size,
                total_items=total,
                total_pages=total_pages,
                has_next=page < total_pages,
                has_previous=page > 1,
            ),
        )

    except ResourceNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except Exception as e:
        logger.error(f"Get user interests error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get interests",
        )


@router.put(
    "/user/interests",
    response_model=Response[list[InterestResponse]],
    summary="Replace user interests",
)
async def replace_user_interests(
    request: UserInterestRequest,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> Response[list[InterestResponse]]:
    """Replace current user's interests with new list.

    Args:
        request: Request with list of interest IDs.
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        Response: Response with new interests.
    """
    try:
        interest_repo = InterestRepository(db)
        user_repo = UserRepository(db)
        interest_service = InterestService(interest_repo, user_repo)

        interests = await interest_service.set_user_interests(
            current_user.id, request.interest_ids
        )

        await db.commit()

        return Response(
            success=True,
            message="Interests replaced successfully",
            data=[InterestResponse.model_validate(interest) for interest in interests],
        )

    except ResourceNotFoundException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Replace interests error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to replace interests",
        )


@router.delete(
    "/user/interests/{interest_id}",
    response_model=MessageResponse,
    summary="Remove interest from current user",
)
async def remove_user_interest(
    interest_id: str,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Remove interest from current user.

    Args:
        interest_id: Interest ID as string.
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        MessageResponse: Success message.
    """
    try:
        interest_uuid = UUID(interest_id)
        interest_repo = InterestRepository(db)
        user_repo = UserRepository(db)
        interest_service = InterestService(interest_repo, user_repo)

        result = await interest_service.remove_interest_from_user(
            current_user.id, interest_uuid
        )

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interest not found for this user",
            )

        await db.commit()

        return MessageResponse(
            success=True,
            message="Interest removed successfully",
        )

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid interest ID")
    except HTTPException:
        await db.rollback()
        raise
    except ResourceNotFoundException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Remove interest error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove interest",
        )

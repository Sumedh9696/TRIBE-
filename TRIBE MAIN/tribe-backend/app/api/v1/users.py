"""User API endpoints."""

from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.database import get_db
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.schemas.user import UserResponse, UserUpdate
from app.core.responses import Response, PaginatedResponse, PaginationMeta, MessageResponse
from app.core.exceptions import TribeException, ResourceNotFoundException
from app.api.dependencies.auth import get_current_verified_user, get_current_user
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=Response[UserResponse],
    summary="Get current user",
)
async def get_current_user_info(
    current_user: User = Depends(get_current_verified_user),
) -> Response[UserResponse]:
    """Get current authenticated user information.

    Args:
        current_user: Current authenticated user.

    Returns:
        Response: Response with user data.
    """
    return Response(
        success=True,
        message="Current user retrieved",
        data=UserResponse.model_validate(current_user),
    )


@router.get(
    "/{user_id}",
    response_model=Response[UserResponse],
    summary="Get user by ID",
    responses={404: {"description": "User not found"}},
)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response[UserResponse]:
    """Get user by ID.

    Args:
        user_id: User ID as string (will be converted to UUID).
        db: Database session.
        current_user: Current authenticated user.

    Returns:
        Response: Response with user data.
    """
    try:
        from uuid import UUID

        user_uuid = UUID(user_id)
        user_repo = UserRepository(db)
        user_service = UserService(user_repo)

        user = await user_service.get_user(user_uuid)

        return Response(
            success=True,
            message="User retrieved",
            data=UserResponse.model_validate(user),
        )

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TribeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put(
    "/me",
    response_model=Response[UserResponse],
    summary="Update current user",
    responses={409: {"description": "Email or username already exists"}},
)
async def update_current_user(
    request: UserUpdate,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> Response[UserResponse]:
    """Update current user information.

    Args:
        request: User update request.
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        Response: Response with updated user data.
    """
    try:
        user_repo = UserRepository(db)
        user_service = UserService(user_repo)

        updated_user = await user_service.update_user(
            user_id=current_user.id,
            email=request.email,
            username=request.username,
        )

        await db.commit()

        return Response(
            success=True,
            message="User updated successfully",
            data=UserResponse.model_validate(updated_user),
        )

    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"User update error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Update failed",
        )


@router.delete(
    "/me",
    response_model=MessageResponse,
    summary="Deactivate current user account",
)
async def deactivate_account(
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Deactivate current user account.

    Args:
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        MessageResponse: Success message.
    """
    try:
        user_repo = UserRepository(db)
        user_service = UserService(user_repo)

        await user_service.deactivate_user(current_user.id)
        await db.commit()

        return MessageResponse(
            success=True,
            message="Account deactivated successfully",
        )

    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Account deactivation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Deactivation failed",
        )


@router.get(
    "",
    response_model=PaginatedResponse[UserResponse],
    summary="List users",
)
async def list_users(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Page size"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
) -> PaginatedResponse[UserResponse]:
    """List all users with pagination.

    Args:
        page: Page number (1-indexed).
        page_size: Number of items per page.
        db: Database session.
        current_user: Current authenticated user.

    Returns:
        PaginatedResponse: Response with paginated user list.
    """
    try:
        user_repo = UserRepository(db)
        user_service = UserService(user_repo)

        skip = (page - 1) * page_size
        users, total = await user_service.list_users(skip, page_size)

        total_pages = (total + page_size - 1) // page_size

        return PaginatedResponse(
            success=True,
            data=[UserResponse.model_validate(user) for user in users],
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
        logger.error(f"List users error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list users",
        )

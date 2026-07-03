"""Authentication API endpoints."""

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.database import get_db
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshTokenRequest,
    VerifyEmailRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    AuthTokenResponse,
)
from app.schemas.user import UserResponse
from app.core.responses import Response, MessageResponse
from app.core.exceptions import (
    TribeException,
    ConflictException,
    InvalidCredentialsException,
    InvalidTokenException,
)
from app.api.dependencies.auth import get_current_verified_user
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=Response[UserResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register new user",
    responses={
        409: {"description": "Email or username already exists"},
        422: {"description": "Validation error"},
    },
)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> Response[UserResponse]:
    """Register a new user.

    Args:
        request: Registration request with email, username, and password.
        db: Database session.

    Returns:
        Response: Registration response with user data.
    """
    try:
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        # Register user
        user = await auth_service.register(
            email=request.email,
            username=request.username,
            password=request.password,
        )

        await db.commit()

        return Response(
            success=True,
            message="User registered successfully. Please verify your email.",
            data=UserResponse.model_validate(user),
        )

    except ConflictException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed",
        )


@router.post(
    "/login",
    response_model=Response[AuthTokenResponse],
    summary="Login user",
    responses={
        401: {"description": "Invalid credentials or email not verified"},
        403: {"description": "Account inactive"},
    },
)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> Response[AuthTokenResponse]:
    """Authenticate user and return access/refresh tokens.

    Args:
        request: Login request with email and password.
        db: Database session.

    Returns:
        Response: Response with authentication tokens.
    """
    try:
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        # Authenticate user
        user = await auth_service.authenticate(
            email=request.email,
            password=request.password,
        )

        # Create tokens
        access_token, access_expires_in = auth_service.create_access_token(user.id)
        refresh_token, _ = auth_service.create_refresh_token(user.id)

        return Response(
            success=True,
            message="Login successful",
            data=AuthTokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=access_expires_in,
            ),
        )

    except InvalidCredentialsException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    except TribeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed",
        )


@router.post(
    "/refresh",
    response_model=Response[AuthTokenResponse],
    summary="Refresh access token",
    responses={401: {"description": "Invalid refresh token"}},
)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
) -> Response[AuthTokenResponse]:
    """Refresh access token using refresh token.

    Args:
        request: Refresh token request.
        db: Database session.

    Returns:
        Response: Response with new access token.
    """
    try:
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        # Refresh token
        new_access_token, expires_in = await auth_service.refresh_access_token(
            request.refresh_token
        )

        return Response(
            success=True,
            message="Token refreshed successfully",
            data=AuthTokenResponse(
                access_token=new_access_token,
                refresh_token=request.refresh_token,
                expires_in=expires_in,
            ),
        )

    except InvalidTokenException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    except TribeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed",
        )


@router.post(
    "/verify-email",
    response_model=Response[UserResponse],
    summary="Verify user email",
    responses={401: {"description": "Invalid or expired verification token"}},
)
async def verify_email(
    request: VerifyEmailRequest,
    db: AsyncSession = Depends(get_db),
) -> Response[UserResponse]:
    """Verify user email using verification token.

    Args:
        request: Email verification request.
        db: Database session.

    Returns:
        Response: Response with updated user data.
    """
    try:
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        # Verify email
        user = await auth_service.verify_email(request.token)
        await db.commit()

        return Response(
            success=True,
            message="Email verified successfully",
            data=UserResponse.model_validate(user),
        )

    except InvalidTokenException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Email verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email verification failed",
        )


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Request password reset",
    responses={404: {"description": "User not found"}},
)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Request password reset. Sends reset token to user email.

    Args:
        request: Forgot password request with email.
        db: Database session.

    Returns:
        MessageResponse: Success message.
    """
    try:
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        # Get user (won't raise if not found, to prevent email enumeration)
        user = await user_repo.get_by_email(request.email)
        if user:
            reset_token = auth_service.create_password_reset_token(user.id)
            # TODO: Send reset token to user email
            logger.info(f"Password reset token created for user: {user.id}")

        return MessageResponse(
            success=True,
            message="If an account exists with this email, you will receive a password reset link",
        )

    except Exception as e:
        logger.error(f"Forgot password error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset request failed",
        )


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Reset password",
    responses={401: {"description": "Invalid or expired reset token"}},
)
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Reset user password using reset token.

    Args:
        request: Reset password request with token and new password.
        db: Database session.

    Returns:
        MessageResponse: Success message.
    """
    try:
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        # Reset password
        await auth_service.reset_password(request.token, request.password)
        await db.commit()

        return MessageResponse(
            success=True,
            message="Password reset successfully",
        )

    except InvalidTokenException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Password reset error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset failed",
        )


@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="Change password",
    responses={401: {"description": "Invalid current password"}},
)
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Change current user password.

    Args:
        request: Change password request.
        current_user: Current authenticated user.
        db: Database session.

    Returns:
        MessageResponse: Success message.
    """
    try:
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        # Change password
        await auth_service.change_password(
            user_id=current_user.id,
            current_password=request.current_password,
            new_password=request.new_password,
        )
        await db.commit()

        return MessageResponse(
            success=True,
            message="Password changed successfully",
        )

    except InvalidCredentialsException as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    except TribeException as e:
        await db.rollback()
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        await db.rollback()
        logger.error(f"Password change error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password change failed",
        )

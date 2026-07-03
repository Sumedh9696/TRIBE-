"""FastAPI application factory and setup."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.config.settings import settings
from app.core.exceptions import TribeException
from app.core.responses import ErrorResponse
from app.lifespan import lifespan
import logging

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """Create and configure FastAPI application.

    Returns:
        FastAPI: Configured FastAPI application instance.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        description="Backend API for Tribe social networking application",
        version=settings.APP_VERSION,
        lifespan=lifespan,
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )

    # Exception handlers
    @app.exception_handler(TribeException)
    async def tribe_exception_handler(request, exc: TribeException):
        """Handle Tribe custom exceptions.

        Args:
            request: Request object.
            exc: Exception object.

        Returns:
            JSONResponse: Error response.
        """
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(
                success=False,
                message=exc.message,
                error_code=exc.error_code,
            ).model_dump(),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request, exc: StarletteHTTPException):
        """Handle HTTP exceptions.

        Args:
            request: Request object.
            exc: Exception object.

        Returns:
            JSONResponse: Error response.
        """
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(
                success=False,
                message=str(exc.detail),
                error_code="HTTP_ERROR",
            ).model_dump(),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc: RequestValidationError):
        """Handle validation exceptions.

        Args:
            request: Request object.
            exc: Exception object.

        Returns:
            JSONResponse: Error response.
        """
        errors = {}
        for error in exc.errors():
            field = ".".join(str(loc) for loc in error["loc"][1:])
            errors[field] = error["msg"]

        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                success=False,
                message="Validation error",
                error_code="VALIDATION_ERROR",
                details=errors,
            ).model_dump(),
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request, exc: Exception):
        """Handle unexpected exceptions.

        Args:
            request: Request object.
            exc: Exception object.

        Returns:
            JSONResponse: Error response.
        """
        logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                success=False,
                message="Internal server error",
                error_code="INTERNAL_SERVER_ERROR",
            ).model_dump(),
        )

    # Health check endpoint
    @app.get("/health", tags=["Health"])
    async def health_check() -> dict:
        """Health check endpoint.

        Returns:
            dict: Health status.
        """
        return {"status": "healthy", "version": settings.APP_VERSION}

    # Root endpoint
    @app.get("/", tags=["Root"])
    async def root() -> dict:
        """Root endpoint.

        Returns:
            dict: API information.
        """
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "redoc": "/redoc",
        }

    # Include routers
    from app.api.v1 import auth, users, profiles, interests

    app.include_router(
        auth.router,
        prefix=settings.API_V1_STR,
    )
    app.include_router(
        users.router,
        prefix=settings.API_V1_STR,
    )
    app.include_router(
        profiles.router,
        prefix=settings.API_V1_STR,
    )
    app.include_router(
        interests.router,
        prefix=settings.API_V1_STR,
    )

    logger.info(f"FastAPI application created: {settings.APP_NAME} v{settings.APP_VERSION}")

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )

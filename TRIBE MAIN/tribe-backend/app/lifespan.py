"""FastAPI lifespan context manager."""

from contextlib import asynccontextmanager
from app.config.database import db_manager
from app.config.logging import setup_logging
import logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app):
    """Manage application lifespan events.

    Args:
        app: FastAPI application instance.

    Yields:
        None
    """
    # Startup
    logger.info("Starting Tribe Backend...")
    setup_logging()

    db_manager.initialize()
    logger.info("Database initialized")

    # Run application
    yield

    # Shutdown
    logger.info("Shutting down Tribe Backend...")
    await db_manager.close()
    logger.info("Database connection closed")

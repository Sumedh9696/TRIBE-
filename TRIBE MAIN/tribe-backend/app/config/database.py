"""Database configuration and session management."""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.pool import NullPool
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)


class DatabaseManager:
    """Manages database connections and sessions."""

    def __init__(self):
        """Initialize the database manager."""
        self.engine = None
        self.async_session_maker = None

    def initialize(self) -> None:
        """Initialize the database engine and session factory."""
        self.engine = create_async_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
            pool_size=settings.DATABASE_POOL_SIZE,
            max_overflow=settings.DATABASE_MAX_OVERFLOW,
            pool_pre_ping=settings.DATABASE_POOL_PRE_PING,
            poolclass=NullPool if settings.ENVIRONMENT == "testing" else None,
        )
        self.async_session_maker = async_sessionmaker(
            self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )
        logger.info(f"Database engine initialized: {settings.DATABASE_URL}")

    async def get_session(self) -> AsyncSession:
        """Get an async database session.

        Yields:
            AsyncSession: An async SQLAlchemy session.
        """
        if self.async_session_maker is None:
            raise RuntimeError("Database not initialized. Call initialize() first.")

        async with self.async_session_maker() as session:
            yield session

    async def close(self) -> None:
        """Close the database engine."""
        if self.engine:
            await self.engine.dispose()
            logger.info("Database engine disposed")

    async def create_all(self) -> None:
        """Create all tables in the database."""
        if self.engine is None:
            raise RuntimeError("Database not initialized. Call initialize() first.")

        from app.core.base_model import Base

        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            logger.info("All database tables created")

    async def drop_all(self) -> None:
        """Drop all tables from the database (for testing only)."""
        if self.engine is None:
            raise RuntimeError("Database not initialized. Call initialize() first.")

        from app.core.base_model import Base

        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            logger.info("All database tables dropped")


# Global database manager instance
db_manager = DatabaseManager()


async def get_db() -> AsyncSession:
    """Dependency for getting database session in FastAPI routes.

    Yields:
        AsyncSession: An async SQLAlchemy session.
    """
    async for session in db_manager.get_session():
        yield session

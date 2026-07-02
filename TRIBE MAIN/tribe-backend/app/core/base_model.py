"""Base model for all SQLAlchemy models."""

from sqlalchemy.orm import DeclarativeBase, mapped_column
from sqlalchemy import DateTime, func
from uuid import UUID, uuid4
from datetime import datetime, UTC
import uuid as uuid_module


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""

    pass


class BaseModel(Base):
    """Base model with common fields for all database models."""

    __abstract__ = True

    id = mapped_column(
        uuid_module.UUID,
        primary_key=True,
        default=uuid4,
        nullable=False,
    )
    created_at = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        """String representation of the model."""
        return f"<{self.__class__.__name__}(id={self.id})>"

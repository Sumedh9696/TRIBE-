"""Session model for tracking user sessions and refresh tokens."""

from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.core.base_model import BaseModel
from datetime import datetime, UTC


class Session(BaseModel):
    """User session model for tracking active sessions and refresh tokens."""

    __tablename__ = "sessions"

    user_id = Column(ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String(500), nullable=False, unique=True, index=True)
    token_type = Column(String(50), default="refresh", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(45), nullable=True)

    # Relationships
    user = relationship("User", back_populates="sessions")

    def __repr__(self) -> str:
        """String representation."""
        return f"<Session(user_id={self.user_id}, is_active={self.is_active})>"

    def is_expired(self) -> bool:
        """Check if session is expired.

        Returns:
            bool: True if session is expired, False otherwise.
        """
        return datetime.now(UTC) >= self.expires_at

"""User model."""

from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.base_model import BaseModel
from datetime import datetime, UTC


class User(BaseModel):
    """User model."""

    __tablename__ = "users"

    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    role_id = Column(ForeignKey("roles.id"), nullable=True)

    # Relationships
    role = relationship("Role", back_populates="users")
    profile = relationship("Profile", back_populates="user", uselist=False)
    user_interests = relationship("UserInterest", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        """String representation."""
        return f"<User(email={self.email}, username={self.username})>"

"""Profile model."""

from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.base_model import BaseModel


class Profile(BaseModel):
    """User profile model."""

    __tablename__ = "profiles"

    user_id = Column(ForeignKey("users.id"), nullable=False, unique=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    bio = Column(Text, nullable=True)
    profile_photo = Column(String(500), nullable=True)
    age_range = Column(String(20), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)

    # Relationships
    user = relationship("User", back_populates="profile")

    def __repr__(self) -> str:
        """String representation."""
        return f"<Profile(user_id={self.user_id}, name={self.first_name} {self.last_name})>"

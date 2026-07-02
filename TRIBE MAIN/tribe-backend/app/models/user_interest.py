"""UserInterest model for many-to-many relationship."""

from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from app.core.base_model import BaseModel


class UserInterest(BaseModel):
    """User-Interest association model."""

    __tablename__ = "user_interests"

    user_id = Column(ForeignKey("users.id"), nullable=False, index=True)
    interest_id = Column(ForeignKey("interests.id"), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="user_interests")
    interest = relationship("Interest", back_populates="user_interests")

    def __repr__(self) -> str:
        """String representation."""
        return f"<UserInterest(user_id={self.user_id}, interest_id={self.interest_id})>"

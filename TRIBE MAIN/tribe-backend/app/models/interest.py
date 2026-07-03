"""Interest model."""

from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from app.core.base_model import BaseModel


class Interest(BaseModel):
    """Interest model."""

    __tablename__ = "interests"

    name = Column(String(100), nullable=False, unique=True, index=True)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Relationships
    user_interests = relationship(
        "UserInterest",
        back_populates="interest",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        """String representation."""
        return f"<Interest(name={self.name}, category={self.category})>"

"""Interest schemas."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class InterestBase(BaseModel):
    """Base interest schema."""

    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=500)


class InterestCreate(InterestBase):
    """Interest creation schema."""

    pass


class InterestResponse(InterestBase):
    """Interest response schema."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic config."""

        from_attributes = True


class UserInterestRequest(BaseModel):
    """User interest request schema."""

    interest_ids: list[UUID] = Field(..., description="List of interest IDs to add")


class UserInterestResponse(BaseModel):
    """User interest response schema."""

    id: UUID
    user_id: UUID
    interest_id: UUID
    interest: Optional[InterestResponse] = None

    class Config:
        """Pydantic config."""

        from_attributes = True

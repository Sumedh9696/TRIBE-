"""User schemas."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)


class UserCreate(UserBase):
    """User creation schema."""

    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update schema."""

    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=100)


class UserResponse(UserBase):
    """User response schema."""

    id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic config."""

        from_attributes = True


class UserDetailResponse(UserResponse):
    """Detailed user response schema with profile."""

    profile: Optional["ProfileResponse"] = None
    interests: Optional[list["InterestResponse"]] = None

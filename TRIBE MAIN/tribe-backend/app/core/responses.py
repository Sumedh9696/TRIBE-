"""Response models and utilities."""

from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, Any
from datetime import datetime

T = TypeVar("T")


class PaginationMeta(BaseModel):
    """Pagination metadata."""

    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_previous: bool


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response model."""

    success: bool
    data: list[T]
    meta: PaginationMeta


class Response(BaseModel, Generic[T]):
    """Generic response model."""

    success: bool
    message: str
    data: Optional[T] = None


class ErrorResponse(BaseModel):
    """Error response model."""

    success: bool = False
    message: str
    error_code: str
    details: Optional[dict[str, Any]] = None


class TokenResponse(BaseModel):
    """Token response model."""

    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int  # seconds


class MessageResponse(BaseModel):
    """Simple message response model."""

    success: bool
    message: str

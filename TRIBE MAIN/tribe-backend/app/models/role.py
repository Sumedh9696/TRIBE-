"""Role model for role-based access control."""

from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.core.base_model import BaseModel


class Role(BaseModel):
    """Role model for RBAC."""

    __tablename__ = "roles"

    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)

    # Relationships
    users = relationship("User", back_populates="role")
    permissions = relationship(
        "Permission",
        secondary="role_permissions",
        back_populates="roles",
    )

    def __repr__(self) -> str:
        """String representation."""
        return f"<Role(name={self.name})>"

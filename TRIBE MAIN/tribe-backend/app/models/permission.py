"""Permission model for role-based access control."""

from sqlalchemy import Column, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.core.base_model import BaseModel

# Association table for Role-Permission many-to-many relationship
role_permissions = Table(
    "role_permissions",
    BaseModel.metadata,
    Column("role_id", ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", ForeignKey("permissions.id"), primary_key=True),
)


class Permission(BaseModel):
    """Permission model for RBAC."""

    __tablename__ = "permissions"

    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)

    # Relationships
    roles = relationship(
        "Role",
        secondary=role_permissions,
        back_populates="permissions",
    )

    def __repr__(self) -> str:
        """String representation."""
        return f"<Permission(name={self.name})>"

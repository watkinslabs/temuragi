from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.base.model import BaseModel

from app.classes import Permission
from app.models import User

class RolePermission(BaseModel):
    """
    Junction table linking roles to permissions
    """
    __depends_on__ = ['Role', 'Permission']
    __tablename__ = 'role_permissions'

    role_uuid = Column(
        UUID(as_uuid=True),
        ForeignKey('roles.uuid', name='fk_role_permissions_role'),
        nullable=False
    )
    permission_uuid = Column(
        UUID(as_uuid=True),
        ForeignKey('permissions.uuid', name='fk_role_permissions_permission'),
        nullable=False
    )

    # Relationships
    role = relationship("Role", back_populates="permissions")
    permission = relationship("Permission", back_populates="role_permissions")

    __table_args__ = (
        UniqueConstraint('role_uuid', 'permission_uuid', name='uq_role_permission'),
        Index('idx_role_permissions_role', 'role_uuid'),
        Index('idx_role_permissions_permission', 'permission_uuid'),
    )

    @classmethod
    def grant_permission(cls, session, role_uuid, permission_name):
        """Grant a permission to a role"""
        # Direct usage now!
        permission = Permission.find_by_name(session, permission_name)
        if not permission:
            return False, f"Permission not found: {permission_name}"

        # Check if already granted
        existing = session.query(cls).filter(
            cls.role_uuid == role_uuid,
            cls.permission_uuid == permission.uuid
        ).first()

        if existing:
            return False, f"Permission already granted: {permission_name}"

        # Grant permission
        role_permission = cls(
            role_uuid=role_uuid,
            permission_uuid=permission.uuid
        )

        session.add(role_permission)
        session.commit()

        return True, role_permission

    @classmethod
    def revoke_permission(cls, session, role_uuid, permission_name):
        """Revoke a permission from a role"""
        # Direct usage
        permission = Permission.find_by_name(session, permission_name)
        if not permission:
            return False, f"Permission not found: {permission_name}"

        # Find role permission
        role_permission = session.query(cls).filter(
            cls.role_uuid == role_uuid,
            cls.permission_uuid == permission.uuid
        ).first()

        if not role_permission:
            return False, f"Permission not granted: {permission_name}"

        session.delete(role_permission)
        session.commit()

        return True, f"Permission revoked: {permission_name}"

    @classmethod
    def user_has_permission(cls, session, user_uuid, permission_name):
        """Check if a user has a specific permission through their role"""
        # Direct model usage
        user = session.query(User).filter(User.uuid == user_uuid).first()
        if not user or not user.role_uuid:
            return False

        # Find permission
        permission = Permission.find_by_name(session, permission_name)
        if not permission:
            return False

        # Check if role has permission
        role_permission = session.query(cls).filter(
            cls.role_uuid == user.role_uuid,
            cls.permission_uuid == permission.uuid
        ).first()

        return role_permission is not None

    @classmethod
    def get_user_permissions(cls, session, user_uuid):
        """Get all permissions for a user through their role"""
        # Direct model usage
        user = session.query(User).filter(User.uuid == user_uuid).first()
        if not user or not user.role_uuid:
            return []

        permissions = session.query(Permission).join(cls).filter(
            cls.role_uuid == user.role_uuid
        ).order_by(Permission.service, Permission.action).all()

        return permissions
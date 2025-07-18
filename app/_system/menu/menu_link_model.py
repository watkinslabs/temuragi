from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, backref

from app.base.model import BaseModel

class MenuLink(BaseModel):
    __depends_on__ = ['MenuTier']  # Add this line
    __tablename__ = 'menu_links'

    name = Column(String(100), nullable=False)
    display = Column(String(100), nullable=False)
    url = Column(String(255), nullable=True)
    url_for = Column(String(255), nullable=True)
    tier_id = Column(UUID(as_uuid=True),
                    ForeignKey('menu_tiers.id', name='fk_menu_links_tier', ondelete='CASCADE'),
                    nullable=True)

    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    position = Column(Integer, default=0, nullable=False)
    visible = Column(Boolean, default=True, nullable=False)
    development = Column(Boolean, default=False, nullable=False)
    new_tab = Column(Boolean, default=False, nullable=False)
    has_submenu = Column(Boolean, default=False, nullable=False)
    search_terms = Column(Text, nullable=True)
    blueprint_name = Column(String(100), nullable=True)  # Store the blueprint name for tracking
    endpoint = Column(String(255), nullable=True)  # Store the endpoint for tracking

    tier = relationship("MenuTier", foreign_keys=[tier_id], back_populates="links")
    user_quick_links = relationship("UserQuickLink", back_populates="link", cascade="all, delete-orphan")


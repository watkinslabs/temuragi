import re
import logging
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from flask import current_app, has_app_context

from app.base.model import BaseModel


class Template(BaseModel):
    """
    Template model for defining reusable page structures and layouts.

    Columns:
    - name: Unique identifier for the template (kebab-case)
    - display_name: Human-readable template name
    - description: Description of template purpose and usage
    - theme_uuid: Foreign key to themes table
    - menu_type_uuid: Foreign key to menu table (which menu to display)
    - layout_type: Layout style (full-width, sidebar-left, sidebar-right, centered)
    - container_class: CSS class for main container
    - sidebar_enabled: Whether template includes sidebar navigation
    - header_type: Header style (fixed, static, minimal, none)
    - footer_type: Footer style (fixed, static, minimal, none)
    - breadcrumbs_enabled: Whether to show breadcrumb navigation
    - is_admin_template: Whether this template requires admin access
    - is_default_template: Whether this is the default template for new pages
    """
    __depends_on__ = ['Theme', 'Menu','Module']
    __tablename__ = 'templates'

    name = Column(String(50), unique=True, nullable=False,
                 comment="Unique template identifier (kebab-case)")
    display_name = Column(String(100), nullable=False,
                         comment="Human-readable template name")
    description = Column(Text, nullable=True,
                        comment="Description of template purpose and usage")
    theme_uuid = Column(UUID(as_uuid=True),
                       ForeignKey('themes.uuid', name='fk_templates_theme'),
                       nullable=True,
                       comment="Foreign key to themes table")
    menu_uuid = Column(UUID(as_uuid=True),
                           ForeignKey('menu.uuid', name='fk_templates_menu'),
                           nullable=True,
                           comment="Foreign key to menu table")
    layout_type = Column(String(50), nullable=False, default='full-width',
                        comment="Layout style (full-width, sidebar-left, sidebar-right, centered)")
    container_class = Column(String(100), nullable=False, default='container-fluid',
                            comment="CSS class for main container")
    sidebar_enabled = Column(Boolean, default=False, nullable=False,
                            comment="Whether template includes sidebar navigation")
    header_type = Column(String(50), nullable=False, default='static',
                        comment="Header style (fixed, static, minimal, none)")
    footer_type = Column(String(50), nullable=False, default='static',
                        comment="Footer style (fixed, static, minimal, none)")
    breadcrumbs_enabled = Column(Boolean, default=True, nullable=False,
                                comment="Whether to show breadcrumb navigation")

    module_uuid = Column(UUID(as_uuid=True),
                    ForeignKey('modules.uuid', name='fk_templates_module'),
                    nullable=True,
                    comment="Module that owns this template (NULL for system)")

    is_system = Column(Boolean, default=False, nullable=False,
                    comment="System-level template/page vs module-owned")
    is_admin_template = Column(Boolean, default=False, nullable=False,
                              comment="Whether template requires admin access")
    is_default_template = Column(Boolean, default=False, nullable=False,
                                comment="Whether this is default template for new pages")

    # Relationships - FIXED
    theme = relationship("Theme", back_populates="templates")
    menu = relationship("Menu", foreign_keys=[menu_uuid])
    pages = relationship("Page", back_populates="template")
    template_fragments = relationship("TemplateFragment", back_populates="template", cascade="all, delete-orphan")
    module = relationship("Module", back_populates="templates")

    # Indexes
    __table_args__ = (
        Index('idx_templates_name', 'name'),
        Index('idx_templates_theme', 'theme_uuid'),
        Index('idx_templates_menu', 'menu_uuid'),
        Index('idx_templates_admin', 'is_admin_template'),
        Index('idx_templates_default', 'is_default_template'),
        Index('idx_templates_layout', 'layout_type'),
        Index('idx_templates_module', 'module_uuid'),

        UniqueConstraint('module_uuid', 'name', name='uq_templates_module_name'),
    )

    @staticmethod
    def _get_logger():
        """Get logger from Flask app context or create fallback"""
        if has_app_context():
            return current_app.logger
        else:
            return logging.getLogger('template')

    def validate_slug(self):
        """Validate slug format"""
        logger = self._get_logger()
        logger.debug(f"Validating slug format for template name: '{self.name}'")
        
        if not re.match(r'^[a-z0-9-]+$', self.name):
            logger.error(f"Invalid template name format: '{self.name}' - must contain only lowercase letters, numbers, and hyphens")
            raise ValueError("Name must contain only lowercase letters, numbers, and hyphens")
        
        logger.debug(f"Template name '{self.name}' passed validation")
        return True

    def validate_references(self, session):
        """Validate all foreign key references exist"""
        logger = self._get_logger()
        logger.debug(f"Validating references for template '{self.name}'")
        
        validation_errors = []
        
        # Validate theme reference
        if self.theme_uuid:
            from app.models import Theme
            theme = session.query(Theme).filter_by(uuid=self.theme_uuid).first()
            if not theme:
                error_msg = f"Referenced theme {self.theme_uuid} does not exist"
                validation_errors.append(error_msg)
                logger.warning(f"Template '{self.name}': {error_msg}")
            else:
                logger.debug(f"Template '{self.name}' theme reference valid: {theme.name}")
        
        # Validate menu reference
        if self.menu_type_uuid:
            from app.models import Menu
            menu = session.query(Menu).filter_by(uuid=self.menu_type_uuid).first()
            if not menu:
                error_msg = f"Referenced menu {self.menu_type_uuid} does not exist"
                validation_errors.append(error_msg)
                logger.warning(f"Template '{self.name}': {error_msg}")
            else:
                logger.debug(f"Template '{self.name}' menu reference valid: {menu.name}")
        
        # Validate module reference
        if self.module_uuid:
            from app.models import Module
            module = session.query(Module).filter_by(uuid=self.module_uuid).first()
            if not module:
                error_msg = f"Referenced module {self.module_uuid} does not exist"
                validation_errors.append(error_msg)
                logger.warning(f"Template '{self.name}': {error_msg}")
            else:
                logger.debug(f"Template '{self.name}' module reference valid: {module.name}")
        
        if validation_errors:
            logger.error(f"Template '{self.name}' validation failed: {len(validation_errors)} errors")
            return False
        
        logger.debug(f"All references validated for template '{self.name}'")
        return True

    def get_fragment_count(self, session):
        """Get count of active fragments for this template"""
        from app.models import TemplateFragment
        
        count = session.query(TemplateFragment).filter_by(
            template_uuid=self.uuid,
            is_active=True
        ).count()
        
        logger = self._get_logger()
        logger.debug(f"Template '{self.name}' has {count} active fragments")
        return count

    def get_fragment_summary(self, session):
        """Get summary of fragments by type"""
        from app.models import TemplateFragment
        
        logger = self._get_logger()
        logger.debug(f"Getting fragment summary for template '{self.name}'")
        
        fragments = session.query(TemplateFragment).filter_by(
            template_uuid=self.uuid,
            is_active=True
        ).all()
        
        summary = {}
        for fragment in fragments:
            if fragment.fragment_type not in summary:
                summary[fragment.fragment_type] = 0
            summary[fragment.fragment_type] += 1
        
        logger.info(f"Template '{self.name}' fragment summary: {summary}")
        return summary

    def has_base_fragment(self, session):
        """Check if template has a base fragment"""
        from app.models import TemplateFragment
        
        logger = self._get_logger()
        
        base_fragment = session.query(TemplateFragment).filter_by(
            template_uuid=self.uuid,
            fragment_type='base',
            is_active=True
        ).first()
        
        has_base = bool(base_fragment)
        if not has_base:
            logger.warning(f"Template '{self.name}' missing base fragment")
        else:
            logger.debug(f"Template '{self.name}' has base fragment: {base_fragment.fragment_key}")
        
        return has_base

    def get_pages_count(self, session):
        """Get count of pages using this template"""
        from app.models import Page
        
        count = session.query(Page).filter_by(template_uuid=self.uuid).count()
        
        logger = self._get_logger()
        logger.debug(f"Template '{self.name}' is used by {count} pages")
        return count

    def set_as_default(self, session):
        """Set this template as the default template"""
        logger = self._get_logger()
        logger.info(f"Setting template '{self.name}' as default")
        
        # Remove default flag from all other templates in same module
        if self.module_uuid:
            session.query(Template).filter_by(
                module_uuid=self.module_uuid,
                is_default_template=True
            ).update({'is_default_template': False})
            logger.debug(f"Removed default flag from other templates in module {self.module_uuid}")
        else:
            # System templates
            session.query(Template).filter_by(
                module_uuid=None,
                is_default_template=True
            ).update({'is_default_template': False})
            logger.debug("Removed default flag from other system templates")
        
        # Set this template as default
        self.is_default_template = True
        
        try:
            session.commit()
            logger.info(f"Template '{self.name}' set as default successfully")
        except Exception as e:
            logger.error(f"Failed to set template '{self.name}' as default: {e}")
            session.rollback()
            raise

    def clone_template(self, session, new_name, new_display_name=None):
        """Create a clone of this template with all its fragments"""
        logger = self._get_logger()
        logger.info(f"Cloning template '{self.name}' to '{new_name}'")
        
        # Create new template
        new_template = Template(
            name=new_name,
            display_name=new_display_name or f"{self.display_name} (Copy)",
            description=f"Cloned from {self.name}",
            theme_uuid=self.theme_uuid,
            menu_type_uuid=self.menu_type_uuid,
            layout_type=self.layout_type,
            container_class=self.container_class,
            sidebar_enabled=self.sidebar_enabled,
            header_type=self.header_type,
            footer_type=self.footer_type,
            breadcrumbs_enabled=self.breadcrumbs_enabled,
            module_uuid=self.module_uuid,
            is_system=self.is_system,
            is_admin_template=self.is_admin_template,
            is_default_template=False  # Clones are never default
        )
        
        session.add(new_template)
        session.flush()  # Get the UUID
        
        # Clone all fragments
        from app.models import TemplateFragment
        fragments = session.query(TemplateFragment).filter_by(
            template_uuid=self.uuid,
            is_active=True
        ).all()
        
        cloned_count = 0
        for fragment in fragments:
            new_fragment = TemplateFragment(
                template_uuid=new_template.uuid,
                fragment_type=fragment.fragment_type,
                fragment_name=fragment.fragment_name,
                fragment_key=fragment.fragment_key,
                template_file_path=fragment.template_file_path,
                content_type=fragment.content_type,
                version_number=1,  # Start fresh
                is_active=True,
                template_source=fragment.template_source,
                template_hash=fragment.template_hash,
                variables_schema=fragment.variables_schema,
                sample_data=fragment.sample_data,
                required_context=fragment.required_context,
                dependencies=fragment.dependencies,
                css_dependencies=fragment.css_dependencies,
                js_dependencies=fragment.js_dependencies,
                description=fragment.description,
                usage_notes=fragment.usage_notes,
                preview_template=fragment.preview_template,
                sort_order=fragment.sort_order,
                is_partial=fragment.is_partial,
                cache_strategy=fragment.cache_strategy,
                cache_duration=fragment.cache_duration,
                change_description=f"Cloned from {self.name}"
            )
            session.add(new_fragment)
            cloned_count += 1
        
        try:
            session.commit()
            logger.info(f"Template '{self.name}' cloned successfully to '{new_name}' with {cloned_count} fragments")
            return new_template
        except Exception as e:
            logger.error(f"Failed to clone template '{self.name}': {e}")
            session.rollback()
            raise

    def get_dependent_pages(self, session, published_only=True):
        """Get all pages that depend on this template"""
        from app.models import Page
        
        logger = self._get_logger()
        
        query = session.query(Page).filter_by(template_uuid=self.uuid)
        if published_only:
            query = query.filter_by(published=True)
        
        pages = query.all()
        
        if published_only:
            visible_pages = [p for p in pages if p.is_visible()]
            logger.debug(f"Template '{self.name}' has {len(visible_pages)} visible dependent pages (total: {len(pages)})")
            return visible_pages
        
        logger.debug(f"Template '{self.name}' has {len(pages)} dependent pages")
        return pages

    def validate_template_integrity(self, session):
        """Comprehensive validation of template integrity"""
        logger = self._get_logger()
        logger.info(f"Validating integrity of template '{self.name}'")
        
        issues = []
        
        # Check basic validations
        try:
            self.validate_slug()
        except ValueError as e:
            issues.append(f"Invalid name format: {e}")
        
        if not self.validate_references(session):
            issues.append("Invalid foreign key references")
        
        # Check for base fragment
        if not self.has_base_fragment(session):
            issues.append("Missing base fragment")
        
        # Check fragment dependencies
        from app.models import TemplateFragment
        if not TemplateFragment.find_circular_dependencies(session, self.uuid):
            issues.append("Circular dependencies detected in fragments")
        
        # Validate each fragment
        fragments = session.query(TemplateFragment).filter_by(
            template_uuid=self.uuid,
            is_active=True
        ).all()
        
        for fragment in fragments:
            if not fragment.validate_dependencies(session):
                issues.append(f"Fragment '{fragment.fragment_key}' has missing dependencies")
        
        if issues:
            logger.warning(f"Template '{self.name}' integrity check failed: {len(issues)} issues found")
            for issue in issues:
                logger.warning(f"  - {issue}")
            return False
        
        logger.info(f"Template '{self.name}' passed all integrity checks")
        return True

    @classmethod
    def get_by_name(cls, session, name, module_uuid=None):
        """Get template by name with optional module scoping"""
        logger = cls._get_logger()
        logger.debug(f"Getting template by name: '{name}', module: {module_uuid}")
        
        query = session.query(cls).filter_by(name=name)
        if module_uuid:
            query = query.filter_by(module_uuid=module_uuid)
        
        template = query.first()
        
        if template:
            logger.debug(f"Found template: '{name}' ({template.uuid})")
        else:
            logger.warning(f"Template not found: '{name}' in module {module_uuid}")
        
        return template

    @classmethod
    def get_default_template(cls, session, module_uuid=None, admin_only=False):
        """Get the default template for a module or system"""
        logger = cls._get_logger()
        logger.debug(f"Getting default template: module={module_uuid}, admin_only={admin_only}")
        
        query = session.query(cls).filter_by(
            module_uuid=module_uuid,
            is_default_template=True
        )
        
        if admin_only:
            query = query.filter_by(is_admin_template=True)
        
        template = query.first()
        
        if template:
            logger.debug(f"Found default template: '{template.name}'")
        else:
            scope = "admin " if admin_only else ""
            context = f"module {module_uuid}" if module_uuid else "system"
            logger.warning(f"No default {scope}template found for {context}")
        
        return template

    @classmethod
    def get_templates_by_type(cls, session, layout_type=None, is_admin=None, module_uuid=None):
        """Get templates filtered by type and other criteria"""
        logger = cls._get_logger()
        logger.debug(f"Getting templates: layout={layout_type}, admin={is_admin}, module={module_uuid}")
        
        query = session.query(cls)
        
        if layout_type:
            query = query.filter_by(layout_type=layout_type)
        
        if is_admin is not None:
            query = query.filter_by(is_admin_template=is_admin)
        
        if module_uuid is not None:
            query = query.filter_by(module_uuid=module_uuid)
        
        templates = query.order_by(cls.name).all()
        
        logger.info(f"Found {len(templates)} templates matching criteria")
        return templates

    def get_render_context(self):
        """Get template context for rendering"""
        logger = self._get_logger()
        logger.debug(f"Getting render context for template '{self.name}'")
        
        context = {
            'template_name': self.name,
            'template_uuid': str(self.uuid),
            'layout_type': self.layout_type,
            'container_class': self.container_class,
            'sidebar_enabled': self.sidebar_enabled,
            'header_type': self.header_type,
            'footer_type': self.footer_type,
            'breadcrumbs_enabled': self.breadcrumbs_enabled,
            'is_admin_template': self.is_admin_template
        }
        
        logger.debug(f"Template '{self.name}' render context prepared")
        return context

    def __repr__(self):
        return f"<Template(name='{self.name}', layout='{self.layout_type}', admin={self.is_admin_template})>"
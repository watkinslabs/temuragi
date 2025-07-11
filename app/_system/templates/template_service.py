import logging
import hashlib
import datetime
from typing import Optional, List, Dict, Any, Union
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models import Template
from app.models import Page
from app.models import TemplateFragment
from app.models import PageFragment
from app.models import Theme

from app.register.database import db_registry


class TemplateService:
    """
    Comprehensive service for CRUD operations on templates, pages, and fragments.
    Handles all template engine functionality including associations and versioning.
    """
    __depends_on__ = ['Template',
                        'Page',
                        'TemplateFragment',
                        'PageFragment',
                        'Theme',]

    def __init__(self, logger: Optional[logging.Logger] = None):
        self.db_session=db_registry._routing_session()

        self.logger = logger or logging.getLogger(__name__)
    
    # =====================================================================
    # TEMPLATE OPERATIONS
    # =====================================================================
    
    def create_template(self, name: str, display_name: str, description: Optional[str] = None,
                       theme_id: Optional[UUID] = None, menu_type_id: Optional[UUID] = None,
                       layout_type: str = 'full-width', container_class: str = 'container-fluid',
                       sidebar_enabled: bool = False, header_type: str = 'static',
                       footer_type: str = 'static', breadcrumbs_enabled: bool = True,
                       module_id: Optional[UUID] = None, is_system: bool = False,
                       is_admin_template: bool = False, is_default_template: bool = False) -> Template:
        """Create a new template with validation"""
        self.logger.info(f"Creating template: {name}")
        
        template = Template(
            name=name,
            display_name=display_name,
            description=description,
            theme_id=theme_id,
            menu_type_id=menu_type_id,
            layout_type=layout_type,
            container_class=container_class,
            sidebar_enabled=sidebar_enabled,
            header_type=header_type,
            footer_type=footer_type,
            breadcrumbs_enabled=breadcrumbs_enabled,
            module_id=module_id,
            is_system=is_system,
            is_admin_template=is_admin_template,
            is_default_template=is_default_template
        )
        
        # Validate slug format
        template.validate_slug()
        
        self.db_session.add(template)
        
        try:
            if is_default_template:
                template.set_as_default(self.db_session)
            else:
                self.db_session.commit()
            
            self.logger.info(f"Template created: {name} ({template.id})")
            return template
            
        except IntegrityError as e:
            self.db_session.rollback()
            self.logger.error(f"Failed to create template {name}: {e}")
            raise ValueError(f"Template with name '{name}' already exists")
    
    def get_template(self, template_id: Union[str, UUID], by_name: bool = False,
                    module_id: Optional[UUID] = None) -> Optional[Template]:
        """Get template by UUID or name"""
        if by_name:
            return Template.get_by_name(template_id, module_id)
        
        return self.db_session.query(Template).filter_by(id=template_id).first()
    
    def update_template(self, template_id: UUID, **kwargs) -> Template:
        """Update template with provided fields"""
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template {template_id} not found")
        
        self.logger.info(f"Updating template: {template.name}")
        
        for key, value in kwargs.items():
            if hasattr(template, key):
                setattr(template, key, value)
        
        # Re-validate if name changed
        if 'name' in kwargs:
            template.validate_slug()
        
        # Handle default template change
        if kwargs.get('is_default_template'):
            template.set_as_default()
        else:
            self.db_session.commit()
        
        self.logger.info(f"Template updated: {template.name}")
        return template
    
    def delete_template(self, template_id: UUID, force: bool = False) -> bool:
        """Delete template if no dependencies exist or force is True"""
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template {template_id} not found")
        
        if template.is_system and not force:
            raise ValueError("Cannot delete system template without force=True")
        
        # Check for dependent pages
        page_count = template.get_pages_count()
        if page_count > 0 and not force:
            raise ValueError(f"Cannot delete template with {page_count} dependent pages")
        
        self.logger.info(f"Deleting template: {template.name}")
        
        try:
            # Cascade will handle fragments
            self.db_session.delete(template)
            self.db_session.commit()
            
            self.logger.info(f"Template deleted: {template.name}")
            return True
            
        except Exception as e:
            self.db_session.rollback()
            self.logger.error(f"Failed to delete template {template.name}: {e}")
            raise
    
    def list_templates(self, module_id: Optional[UUID] = None, layout_type: Optional[str] = None,
                      is_admin: Optional[bool] = None, include_system: bool = True) -> List[Template]:
        """List templates with optional filtering"""
        return Template.get_templates_by_type(
            layout_type=layout_type,
            is_admin=is_admin,
            module_id=module_id if include_system or module_id else module_id
        )
    
    def clone_template(self, template_id: UUID, new_name: str, 
                      new_display_name: Optional[str] = None) -> Template:
        """Clone a template with all its fragments"""
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template {template_id} not found")
        
        return template.clone_template(new_name, new_display_name)
    
    # =====================================================================
    # TEMPLATE FRAGMENT OPERATIONS
    # =====================================================================
    
    def create_template_fragment(self, template_id: UUID, fragment_type: str,
                               fragment_name: str, fragment_key: str,
                               template_file_path: str, template_source: str,
                               content_type: str = 'text/html',
                               compiled_file_path: Optional[str] = None,
                               version_label: Optional[str] = None,
                               is_active: bool = True, **kwargs) -> TemplateFragment:
        """Create a new template fragment"""
        self.logger.info(f"Creating template fragment: {fragment_key}")
        
        # Get next version number
        version_number = TemplateFragment.get_next_version_number( template_id, template_file_path
        )
        
        # Calculate content hash
        content_hash = hashlib.sha256(template_source.encode('utf-8')).hexdigest()
        
        fragment = TemplateFragment(
            template_id=template_id,
            fragment_type=fragment_type,
            fragment_name=fragment_name,
            fragment_key=fragment_key,
            template_file_path=template_file_path,
            compiled_file_path=compiled_file_path,
            content_type=content_type,
            version_number=version_number,
            version_label=version_label,
            is_active=is_active,
            template_source=template_source,
            template_hash=content_hash,
            **kwargs
        )
        
        self.db_session.add(fragment)
        
        try:
            if is_active:
                # Deactivate other versions first
                self.db_session.query(TemplateFragment)\
                           .filter_by(template_id=template_id,
                                     template_file_path=template_file_path)\
                           .update({'is_active': False})
                fragment.is_active = True
            
            self.db_session.commit()
            self.logger.info(f"Template fragment created: {fragment_key} v{version_number}")
            return fragment
            
        except Exception as e:
            self.db_session.rollback()
            self.logger.error(f"Failed to create template fragment {fragment_key}: {e}")
            raise
    
    def get_template_fragment(self, fragment_id: UUID) -> Optional[TemplateFragment]:
        """Get template fragment by UUID"""
        return self.db_session.query(TemplateFragment).filter_by(id=fragment_id).first()
    
    def get_template_fragment_by_key(self, template_id: UUID, 
                                   fragment_key: str) -> Optional[TemplateFragment]:
        """Get active template fragment by key"""
        return TemplateFragment.get_active_by_key(template_id, fragment_key)
    
    def update_template_fragment(self, fragment_id: UUID, **kwargs) -> TemplateFragment:
        """Update template fragment"""
        fragment = self.get_template_fragment(fragment_id)
        if not fragment:
            raise ValueError(f"Template fragment {fragment_id} not found")
        
        self.logger.info(f"Updating template fragment: {fragment.fragment_key}")
        
        # Handle content update specially
        if 'template_source' in kwargs:
            fragment.update_content_and_hash(kwargs['template_source'])
            del kwargs['template_source']
        
        for key, value in kwargs.items():
            if hasattr(fragment, key):
                setattr(fragment, key, value)
        
        self.db_session.commit()
        self.logger.info(f"Template fragment updated: {fragment.fragment_key}")
        return fragment
    
    def activate_template_fragment_version(self, fragment_id: UUID) -> TemplateFragment:
        """Activate a specific template fragment version"""
        return TemplateFragment.set_active_version(fragment_id)
    
    def list_template_fragments(self, template_id: UUID, 
                              fragment_type: Optional[str] = None,
                              active_only: bool = True) -> List[TemplateFragment]:
        """List template fragments with optional filtering"""
        if fragment_type:
            return TemplateFragment.get_fragments_by_type( template_id, fragment_type )
        
        if active_only:
            return TemplateFragment.get_all_active_for_template(template_id)
        
        return self.db_session.query(TemplateFragment)\
                          .filter_by(template_id=template_id)\
                          .order_by(TemplateFragment.fragment_type, TemplateFragment.sort_order)\
                          .all()
    
    def get_template_fragment_versions(self, template_id: UUID, 
                                     template_file_path: str) -> List[TemplateFragment]:
        """Get all versions of a template fragment file"""
        return TemplateFragment.get_file_version_history( template_id, template_file_path )
    
    # =====================================================================
    # PAGE OPERATIONS
    # =====================================================================
    
    def create_page(self, name: str, title: str, slug: str,
                   template_id: Optional[UUID] = None,
                   module_id: Optional[UUID] = None,
                   published: bool = False, **kwargs) -> Page:
        """Create a new page"""
        self.logger.info(f"Creating page: {slug}")
        
        page = Page(
            name=name,
            title=title,
            slug=slug,
            template_id=template_id,
            module_id=module_id,
            published=published,
            **kwargs
        )
        
        self.db_session.add(page)
        
        try:
            self.db_session.commit()
            self.logger.info(f"Page created: {slug} ({page.id})")
            return page
            
        except IntegrityError as e:
            self.db_session.rollback()
            self.logger.error(f"Failed to create page {slug}: {e}")
            raise ValueError(f"Page with slug '{slug}' already exists")
    
    def get_page(self, page_id: Union[str, UUID], by_slug: bool = False,
                include_unpublished: bool = False) -> Optional[Page]:
        """Get page by UUID or slug"""
        if by_slug:
            return Page.get_by_slug( page_id, include_unpublished)
        
        return self.db_session.query(Page).filter_by(id=page_id).first()
    
    def update_page(self, page_id: UUID, **kwargs) -> Page:
        """Update page with provided fields"""
        page = self.get_page(page_id)
        if not page:
            raise ValueError(f"Page {page_id} not found")
        
        self.logger.info(f"Updating page: {page.slug}")
        
        for key, value in kwargs.items():
            if hasattr(page, key):
                setattr(page, key, value)
        
        self.db_session.commit()
        self.logger.info(f"Page updated: {page.slug}")
        return page
    
    def publish_page(self, page_id: UUID, 
                    publish_date: Optional[datetime.datetime] = None) -> Page:
        """Publish a page"""
        page = self.get_page(page_id)
        if not page:
            raise ValueError(f"Page {page_id} not found")
        
        page.publish(publish_date)
        return page
    
    def unpublish_page(self, page_id: UUID) -> Page:
        """Unpublish a page"""
        page = self.get_page(page_id)
        if not page:
            raise ValueError(f"Page {page_id} not found")
        
        page.unpublish()
        return page
    
    def delete_page(self, page_id: UUID, force: bool = False) -> bool:
        """Delete page"""
        page = self.get_page(page_id)
        if not page:
            raise ValueError(f"Page {page_id} not found")
        
        self.logger.info(f"Deleting page: {page.slug}")
        
        try:
            # Cascade will handle fragments
            self.db_session.delete(page)
            self.db_session.commit()
            
            self.logger.info(f"Page deleted: {page.slug}")
            return True
            
        except Exception as e:
            self.db_session.rollback()
            self.logger.error(f"Failed to delete page {page.slug}: {e}")
            raise
    
    def list_pages(self, module_id: Optional[UUID] = None, published_only: bool = True,
                  featured_only: bool = False, limit: Optional[int] = None) -> List[Page]:
        """List pages with optional filtering"""
        return Page.get_published_pages(
            module_id=module_id,
            featured_only=featured_only,
            limit=limit
        ) if published_only else self.db_session.query(Page)\
                                              .filter_by(module_id=module_id)\
                                              .order_by(Page.sort_order, Page.created_at.desc())\
                                              .limit(limit).all() if limit else \
                                 self.db_session.query(Page)\
                                              .filter_by(module_id=module_id)\
                                              .order_by(Page.sort_order, Page.created_at.desc())\
                                              .all()
    
    def search_pages(self, search_term: str, published_only: bool = True) -> List[Page]:
        """Search pages by title, name, or slug"""
        return Page.search_pages(search_term, published_only)
    
    # =====================================================================
    # PAGE FRAGMENT OPERATIONS
    # =====================================================================
    
    def create_page_fragment(self, page_id: UUID, fragment_type: str,
                           fragment_name: str, fragment_key: str,
                           content_source: str, content_type: str = 'text/html',
                           version_label: Optional[str] = None,
                           is_active: bool = True, **kwargs) -> PageFragment:
        """Create a new page fragment"""
        self.logger.info(f"Creating page fragment: {fragment_key}")
        
        # Get next version number
        version_number = PageFragment.get_next_version_number(page_id, fragment_key)
        
        # Calculate content hash
        content_hash = hashlib.sha256(content_source.encode('utf-8')).hexdigest()
        
        fragment = PageFragment(
            page_id=page_id,
            fragment_type=fragment_type,
            fragment_name=fragment_name,
            fragment_key=fragment_key,
            content_type=content_type,
            version_number=version_number,
            version_label=version_label,
            is_active=is_active,
            content_source=content_source,
            content_hash=content_hash,
            **kwargs
        )
        
        self.db_session.add(fragment)
        
        try:
            if is_active:
                # Deactivate other versions first
                self.db_session.query(PageFragment)\
                           .filter_by(page_id=page_id, fragment_key=fragment_key)\
                           .update({'is_active': False})
                fragment.is_active = True
            
            self.db_session.commit()
            self.logger.info(f"Page fragment created: {fragment_key} v{version_number}")
            return fragment
            
        except Exception as e:
            self.db_session.rollback()
            self.logger.error(f"Failed to create page fragment {fragment_key}: {e}")
            raise
    
    def get_page_fragment(self, fragment_id: UUID) -> Optional[PageFragment]:
        """Get page fragment by UUID"""
        return self.db_session.query(PageFragment).filter_by(id=fragment_id).first()
    
    def get_page_fragment_by_key(self, page_id: UUID, 
                               fragment_key: str) -> Optional[PageFragment]:
        """Get active page fragment by key"""
        return PageFragment.get_active_by_key(self.db_session, page_id, fragment_key)
    
    def update_page_fragment(self, fragment_id: UUID, **kwargs) -> PageFragment:
        """Update page fragment"""
        fragment = self.get_page_fragment(fragment_id)
        if not fragment:
            raise ValueError(f"Page fragment {fragment_id} not found")
        
        self.logger.info(f"Updating page fragment: {fragment.fragment_key}")
        
        # Handle content update specially
        if 'content_source' in kwargs:
            fragment.update_content_and_hash(kwargs['content_source'])
            del kwargs['content_source']
        
        for key, value in kwargs.items():
            if hasattr(fragment, key):
                setattr(fragment, key, value)
        
        self.db_session.commit()
        self.logger.info(f"Page fragment updated: {fragment.fragment_key}")
        return fragment
    
    def activate_page_fragment_version(self, fragment_id: UUID) -> PageFragment:
        """Activate a specific page fragment version"""
        return PageFragment.set_active_version(fragment_id)
    
    def list_page_fragments(self, page_id: UUID, fragment_type: Optional[str] = None,
                          include_hidden: bool = False) -> List[PageFragment]:
        """List page fragments with optional filtering"""
        if fragment_type:
            return PageFragment.get_fragments_by_type( page_id, fragment_type, include_hidden)
        
        return PageFragment.get_all_active_for_page(page_id, include_hidden)
    
    def get_page_fragment_versions(self, page_id: UUID, 
                                 fragment_key: str) -> List[PageFragment]:
        """Get all versions of a page fragment"""
        return PageFragment.get_fragment_version_history( page_id, fragment_key )
    
    # =====================================================================
    # THEME OPERATIONS
    # =====================================================================
    
    def get_theme(self, theme_id: UUID) -> Optional[Theme]:
        """Get theme by UUID"""
        return self.db_session.query(Theme).filter_by(id=theme_id).first()
    
    def list_themes(self) -> List[Theme]:
        """List all themes"""
        return self.db_session.query(Theme).order_by(Theme.name).all()
    
    # =====================================================================
    # ASSOCIATIONS AND RELATIONSHIPS
    # =====================================================================
    
    def assign_template_to_page(self, page_id: UUID, template_id: UUID) -> Page:
        """Assign a template to a page"""
        page = self.get_page(page_id)
        template = self.get_template(template_id)
        
        if not page:
            raise ValueError(f"Page {page_id} not found")
        if not template:
            raise ValueError(f"Template {template_id} not found")
        
        page.template_id = template_id
        page.validate_template_exists()
        
        self.db_session.commit()
        self.logger.info(f"Template {template.name} assigned to page {page.slug}")
        return page
    
    def get_pages_by_template(self, template_id: UUID, 
                            published_only: bool = True) -> List[Page]:
        """Get all pages using a specific template"""
        return Page.get_pages_by_template( template_id, published_only)
    
    def get_template_structure(self, template_id: UUID) -> Dict[str, Any]:
        """Get complete template structure including fragments"""
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template {template_id} not found")
        
        fragments = TemplateFragment.get_template_structure( template_id)
        
        return {
            'template': template,
            'fragments': fragments,
            'fragment_count': len(fragments),
            'integrity_check': template.validate_template_integrity()
        }
    
    def get_page_structure(self, page_id: UUID, 
                         include_hidden: bool = False) -> Dict[str, Any]:
        """Get complete page structure including fragments"""
        page = self.get_page(page_id)
        if not page:
            raise ValueError(f"Page {page_id} not found")
        
        fragments = PageFragment.get_page_fragment_structure( page_id, include_hidden )
        
        return {
            'page': page,
            'fragments': fragments,
            'fragment_count': len(fragments),
            'template': self.get_template(page.template_id) if page.template_id else None
        }
    
    # =====================================================================
    # UTILITY METHODS
    # =====================================================================
    
    def validate_template_integrity(self, template_id: UUID) -> Dict[str, Any]:
        """Comprehensive template integrity validation"""
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template {template_id} not found")
        
        issues = []
        
        # Basic template validation
        is_valid = template.validate_template_integrity()
        
        # Check for circular dependencies
        has_cycles = not TemplateFragment.find_circular_dependencies(template_id)
        if has_cycles:
            issues.append("Circular dependencies detected")
        
        # Fragment compilation check
        fragments = self.list_template_fragments(template_id)
        needs_compilation = [f for f in fragments if f.needs_compilation()]
        
        return {
            'template_id': template_id,
            'is_valid': is_valid and not has_cycles,
            'has_circular_dependencies': has_cycles,
            'fragments_needing_compilation': len(needs_compilation),
            'compilation_details': [f.get_compilation_info() for f in needs_compilation],
            'issues': issues
        }
    
    def get_dashboard_stats(self, module_id: Optional[UUID] = None) -> Dict[str, Any]:
        """Get dashboard statistics for the template engine"""
        base_query_args = {'module_id': module_id} if module_id else {}
        
        # Template stats
        total_templates = self.db_session.query(Template).filter_by(**base_query_args).count()
        admin_templates = self.db_session.query(Template).filter_by(
            is_admin_template=True, **base_query_args
        ).count()
        
        # Page stats
        total_pages = self.db_session.query(Page).filter_by(**base_query_args).count()
        published_pages = self.db_session.query(Page).filter_by(
            published=True, **base_query_args
        ).count()
        
        # Fragment stats
        if module_id:
            template_ids = [t.id for t in self.db_session.query(Template.id).filter_by(module_id=module_id)]
            page_ids = [p.id for p in self.db_session.query(Page.id).filter_by(module_id=module_id)]
            
            template_fragments = self.db_session.query(TemplateFragment).filter(
                TemplateFragment.template_id.in_(template_ids)
            ).count() if template_ids else 0
            
            page_fragments = self.db_session.query(PageFragment).filter(
                PageFragment.page_id.in_(page_ids)
            ).count() if page_ids else 0
        else:
            template_fragments = self.db_session.query(TemplateFragment).count()
            page_fragments = self.db_session.query(PageFragment).count()
        
        return {
            'templates': {
                'total': total_templates,
                'admin_only': admin_templates,
                'public': total_templates - admin_templates
            },
            'pages': {
                'total': total_pages,
                'published': published_pages,
                'unpublished': total_pages - published_pages
            },
            'fragments': {
                'template_fragments': template_fragments,
                'page_fragments': page_fragments,
                'total_fragments': template_fragments + page_fragments
            }
        }
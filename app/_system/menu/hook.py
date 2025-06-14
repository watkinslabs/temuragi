from flask import url_for, render_template_string, g, current_app, request

def register_menu_injector(app):
    """
    Initialize the extension with a Flask application.
    
    Args:
        app: Flask application
    """
    
    
    # Add template globals
    @app.context_processor
    def inject_menu_functions():
        

        def get_menu_builder():
            db_session = g.session if hasattr(g, 'session') else current_app.db_session
            #if not hasattr(g, 'menu_builder'):
            #    g.menu_builder = MenuBuilder(db_session)
            #return g.menu_builder
            return None

        if request.path.startswith(app.config['ADMIN_ROUTE_PREFIX']):
            menu_tree="ADMIN"
        else:
            menu_tree="MAIN"
        """
        return {
            'get_menu': lambda menu_type=menu_tree, user_uuid=None: 
                get_menu_builder().get_menu_structure(menu_type, user_uuid),
            'render_menu': lambda menu_structure, template_path=None, template_string=None, **kwargs:
                get_menu_builder().render_menu(menu_structure, template_path, template_string, **kwargs),
            'get_quick_links': lambda user_uuid:
                get_menu_builder().get_user_quick_links(user_uuid),
            'render_quick_links': lambda user_uuid, template_path=None, template_string=None, **kwargs:
                get_menu_builder().render_user_quick_links(user_uuid, template_path, template_string, **kwargs),
            'menu_templates': MenuTemplates
        }
        """
        return {
             
        }
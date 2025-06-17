import os
import importlib
import inspect
from collections import defaultdict, deque
from flask import Flask, g
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session

from app.config import config


class Engines:
    """Holds your engines.  One for config DB, and lazily-created ones for each target DSN."""
    def __init__(self, config_uri):
        # single engine to your Postgres "config server"
        self.config_engine = create_engine(config_uri, pool_size=5, max_overflow=10)
        # session factory for config DB
        self.ConfigSession = sessionmaker(bind=self.config_engine)
        # cache for per-page engines
        self._target_engines = {}

    def get_config_session(self):
        return self.ConfigSession()

    def get_target_engine(self, dsn, **opts):
        # reuse an engine per-DSN (keyed by the full DSN string)
        if dsn not in self._target_engines:
            self._target_engines[dsn] = create_engine(dsn, **opts)
        return self._target_engines[dsn]
    
def register_db(app: Flask):
    """Initialize database and register all models with dependency-aware ordering"""

    # Create database engine and session
    config_engine = create_engine(app.config['DATABASE_URI'])
    app.db_session = scoped_session(sessionmaker(bind=config_engine))

    # Create all tables BEFORE creating permissions
    create_all_tables(app, config_engine)

    # Setup session cleanup
    @app.teardown_appcontext
    def cleanup_sessions(exc=None):
        app.db_session.remove()

    # Make session available in request context
    @app.before_request
    def setup_request_context():
        if not hasattr(g, 'session'):
            g.session = app.db_session


def create_all_tables(app, engine):
    """Create database tables from all loaded models using existing dependency resolution"""
    try:
        # Find BaseModel
        base_paths = [
            'app.base.model',
            'app._system.base',
            'app.base'
        ]

        BaseModel = None
        for path in base_paths:
            try:
                module = importlib.import_module(path)
                BaseModel = getattr(module, 'BaseModel', None)
                if BaseModel:
                    break
            except ImportError:
                continue

        if not BaseModel:
            raise ImportError("BaseModel not found")

        app.logger.info("Creating database tables using existing dependency resolution...")

        from  .classes import _class_registry, get_model
        app.get_model=get_model

        model_classes = []
        seen_tables = set()
        
        for name, model_class in _class_registry.items():
            if (hasattr(model_class, '__tablename__') and
                hasattr(model_class, '__name__') and
                name == model_class.__name__ and  # Only actual class names
                model_class.__tablename__ not in seen_tables):
                model_classes.append(model_class)
                seen_tables.add(model_class.__tablename__)

        app.logger.info(f"Found {len(model_classes)} model classes")

        # Create all tables - SQLAlchemy handles the actual dependency order
        BaseModel.metadata.create_all(engine, checkfirst=True)

        app.logger.info("Database tables created successfully")

        # Log table info
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = current_schema()
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            app.logger.info(f"Created {len(tables)} tables: {', '.join(tables)}")

    except Exception as e:
        app.logger.error(f"Failed to create tables: {e}")
        raise


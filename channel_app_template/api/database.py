from typing import Generator
from sqlalchemy.orm import scoped_session, sessionmaker
from channel_app.database import services


def get_db() -> Generator:
    db_service = services.DatabaseService()
    db_engine = db_service.create_engine()
    session = scoped_session(sessionmaker(bind=db_engine))
    
    try:
        yield session
    finally:
        session.close()
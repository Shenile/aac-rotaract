import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# user = os.getenv('user')
# password = os.getenv('password')
# host = os.getenv('host')
# port = int(os.getenv('port'))
# dbname = os.getenv('dbname')

# db_url = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"

db_url = os.getenv('db_url')
engine = create_engine(db_url)
session_local = sessionmaker(autocommit = False, autoflush = False, bind=engine)

Base = declarative_base()

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()
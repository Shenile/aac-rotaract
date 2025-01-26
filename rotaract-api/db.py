import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Fetch database URL from environment variables
db_url = os.getenv('db_url')

if db_url is None:
    logger.error("DATABASE_URL is not set in environment variables.")
else:
    logger.info(f"Connecting to database at a {db_url}")

# Create SQLAlchemy engine and session
try:
    engine = create_engine(db_url)
    # Try to establish a connection
    connection = engine.connect()
    logger.info("Database connection established successfully.")
    connection.close()  # Close the connection after successful check
except SQLAlchemyError as e:
    logger.error(f"Database connection failed: {str(e)}")
    # Optionally raise the error to stop further execution
    raise

# Session local and base setup
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()


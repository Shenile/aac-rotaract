from db import session_local
from models import Rotaract_Students

# Function to clean up the dummy data (delete all records in the table)
def clean_up_data(db):
    try:
        # Delete all records from the Rotaract_Students table
        db.query(Rotaract_Students).delete()
        db.commit()
        print("All dummy data has been deleted successfully.")
    except Exception as e:
        db.rollback()  # Rollback in case of any error
        print(f"Error during cleanup: {e}")

# Script entry point
if __name__ == "__main__":
    db = session_local()
    clean_up_data(db)

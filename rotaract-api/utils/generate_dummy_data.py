import random
from faker import Faker
from sqlalchemy.orm import Session
from db import session_local
from models import Rotaract_Students

# Initialize Faker
fake = Faker()

# Function to generate dummy data
def generate_dummy_data(db: Session, num_records: int = 100):
    for _ in range(num_records):
        student = Rotaract_Students(
            roll_no=fake.unique.random_number(digits=8),  # Generate unique roll numbers
            name=fake.name(),
            email=fake.unique.email(),
            gender=random.choice(['Male', 'Female', 'Other']),
            dept=random.choice(['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Biotech']),
            startYear=random.choice([2020, 2021, 2022]),
            endYear=random.choice([2024, 2025, 2026]),
            mobileNo=fake.phone_number()
        )
        db.add(student)

    # Commit the transaction to save the data
    db.commit()
    print(f"{num_records} dummy students added successfully.")

# Script entry point
if __name__ == "__main__":
    db = session_local()
    generate_dummy_data(db, num_records=100)  # You can adjust the number of records here

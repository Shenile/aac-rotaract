import logging
from fastapi import UploadFile, File
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import get_db
from models import Rotaract_Students
from typing import List
import pandas as pd
from utils.data_preprocessing_utils import standardize_name
from pydantic_models import StudentLoginModel, StudentBase, StudentCreate, StudentUpdate, AdminLoginModel

# FastAPI app initialization
app = FastAPI()
origins = [
    "http://localhost:5173",  # Update this URL if your frontend is hosted elsewhere
    "http://127.0.0.1:5173",  # Sometimes used with localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"Hello": "World"}

# Create a new student
@app.post("/students/", response_model=StudentBase)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    logger.info(f"Attempting to create student with email: {student.email}")
    db_student = db.query(Rotaract_Students).filter(Rotaract_Students.email == student.email).first()
    if db_student:
        logger.warning(f"Student with email {student.email} already exists")
        raise HTTPException(status_code=400, detail="Student with this email already exists")

    new_student = Rotaract_Students(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    logger.info(f"Student created successfully with ID: {new_student.id}")
    return new_student

# Get all students
@app.get("/students/", response_model=List[StudentBase])
def get_students(db: Session = Depends(get_db)):
    logger.info("Fetching all students")
    students = db.query(Rotaract_Students).all()
    logger.info(students)
    logger.info(f"Found {len(students)} students")
    return students

# Get student by ID
@app.get("/students/{student_id}", response_model=StudentBase)
def get_student(student_id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching student with ID: {student_id}")
    student = db.query(Rotaract_Students).filter(Rotaract_Students.id == student_id).first()
    if not student:
        logger.warning(f"Student with ID {student_id} not found")
        raise HTTPException(status_code=404, detail="Student not found")
    logger.info(f"Student with ID {student_id} found")
    return student

# Update student info
@app.put("/students/{student_id}", response_model=StudentBase)
def update_student(student_id: int, student: StudentUpdate, db: Session = Depends(get_db)):
    logger.info(f"Attempting to update student with ID: {student_id}")
    db_student = db.query(Rotaract_Students).filter(Rotaract_Students.id == student_id).first()
    if not db_student:
        logger.warning(f"Student with ID {student_id} not found for update")
        raise HTTPException(status_code=404, detail="Student not found")

    # Update student attributes
    for key, value in student.dict().items():
        setattr(db_student, key, value)

    db.commit()
    db.refresh(db_student)
    logger.info(f"Student with ID {student_id} updated successfully")
    return db_student

# Delete student
@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    logger.info(f"Attempting to delete student with ID: {student_id}")
    db_student = db.query(Rotaract_Students).filter(Rotaract_Students.id == student_id).first()
    if not db_student:
        logger.warning(f"Student with ID {student_id} not found for deletion")
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(db_student)
    db.commit()
    logger.info(f"Student with ID {student_id} deleted successfully")
    return {"message": "Student deleted successfully"}

@app.delete("/students/")
def delete_students(db: Session = Depends(get_db)):
    try:
        db.query(Rotaract_Students).delete()
        db.commit()
        logger.info("All dummy data has been deleted successfully.")
        return {"message": "All students deleted successfully"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error during cleanup: {e}")
        raise HTTPException(status_code=500, detail=f"Error during cleanup: {str(e)}")

@app.post("/student-login")
def student_login(login_data: StudentLoginModel, db: Session = Depends(get_db)):
    roll_no, password = login_data.roll_no, login_data.password
    print(roll_no, password)

    # Query the student by roll number
    student = db.query(Rotaract_Students).filter(Rotaract_Students.roll_no == roll_no).first()
    print(f'student {student}')
    # Check if student exists and roll_no matches password
    if student:
        if roll_no == password:  # Roll number is used as the password
            return {
                "message": "Login successful",
                "student_data": {
                    "roll_no": student.roll_no,
                    "name": student.name,
                "student": student
                }
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid roll number or password")
    else:
        raise HTTPException(status_code=404, detail="Student not found")

@app.post("/admin-login")
def admin_login(login_data: AdminLoginModel, db: Session = Depends(get_db)):
    name, password = login_data.name, login_data.password

    # Validate the roll number and password
    if name == password:
        if name == ADMIN_NAME and password == ADMIN_PASSWORD:
            return {
                "name": name,
                "password": password
            }
        else:
            raise HTTPException(status_code=404, detail="Invalid Credentials")
    else:
        raise HTTPException(status_code=401, detail="Invalid admin id or password")

@app.post("/upload")
def file_upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    logger.info(f"Received file upload request for file: {file.filename}")

    # Read the file content
    try:
        logger.info(f"File content type: {file.content_type}")
        # Handle CSV files
        if file.content_type == "text/csv":
            logger.info("Processing CSV file...")
            df = pd.read_csv(file.file)
        # Handle Excel files (both .xls and .xlsx)
        elif file.content_type in ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                   "application/vnd.ms-excel"]:
            logger.info("Processing Excel file...")
            df = pd.read_excel(file.file)
        else:
            logger.error("Unsupported file type. Expected CSV or Excel.")
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a CSV or Excel file.")
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

    # Validate required columns
    required_columns = ["roll_no", "name", "email", "gender", "dept", "startYear", "endYear", "mobileNo"]
    if not all(column in df.columns for column in required_columns):
        missing_columns = [column for column in required_columns if column not in df.columns]
        logger.warning(f"Missing required columns: {missing_columns}")
        raise HTTPException(status_code=400, detail=f"Missing required columns. Expected: {required_columns}")

    logger.info("Columns validated successfully.")

    df["roll_no"] = df["roll_no"].str.upper()
    df["name"] = df["name"].apply(standardize_name)

    # Insert records into the database
    try:
        for _, row in df.iterrows():
            logger.info(f"Checking if record for roll_no: {row['roll_no']} exists")
            # Check if the student with the same roll_no already exists in the database
            existing_student = db.query(Rotaract_Students).filter(Rotaract_Students.roll_no == row['roll_no']).first()

            if existing_student:
                logger.info(f"Record for roll_no: {row['roll_no']} already exists, skipping insertion.")
                continue  # Skip this record or handle accordingly

            # If the student doesn't exist, create a new record
            logger.info(f"Inserting record for roll_no: {row['roll_no']}")
            record = Rotaract_Students(
                roll_no=row["roll_no"],
                name=row["name"],
                email=row["email"],
                gender=row["gender"],
                dept=row["dept"],
                startYear=row["startYear"],
                endYear=row["endYear"],
                mobileNo=row["mobileNo"]
            )
            db.add(record)

        db.commit()
        logger.info("Records inserted into the database successfully.")
    except Exception as e:
        db.rollback()
        logger.error(f"Error inserting records into the database: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error inserting records into the database: {str(e)}")

    logger.info("File processed and records inserted successfully.")
    return {"message": "File processed and records inserted successfully."}


ADMIN_NAME = 'aac-rotaract-admin'
ADMIN_PASSWORD = 'aac-rotaract-admin'

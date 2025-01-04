import logging
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import get_db
from models import Rotaract_Students
from pydantic import BaseModel
from typing import List

# FastAPI app initialization
app = FastAPI()
origins = [
    "http://localhost:5173",  # Update this URL if your frontend is hosted elsewhere
    "http://127.0.0.1:5173",  # Sometimes used with localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def cors_debug(request, call_next):
    response = await call_next(request)
    logger.info(f"CORS Headers: {response.headers.get('access-control-allow-origin')}")
    return response

# Pydantic model for student data (request body validation)
class StudentBase(BaseModel):
    id: int
    roll_no: str
    name: str
    email: str
    gender: str
    dept: str
    startYear: int
    endYear: int
    mobileNo: str

class StudentCreate(BaseModel):
    roll_no: str
    name: str
    email: str
    gender: str
    dept: str
    startYear: int
    endYear: int
    mobileNo: str

class StudentUpdate(BaseModel):
    id: int
    roll_no: str
    name: str
    email: str
    gender: str
    dept: str
    startYear: int
    endYear: int
    mobileNo: str

class StudentLoginModel(BaseModel):
    roll_no: str
    password: str

class AdminLoginModel(BaseModel):
    name: str
    password: str

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


ADMIN_NAME = 'aac-rotaract-admin'
ADMIN_PASSWORD = 'aac-rotaract-admin'
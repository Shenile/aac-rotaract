import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app import app, get_db
from models import Base, Rotaract_Students
from pydantic_models import StudentCreate, StudentUpdate, StudentLoginModel, AdminLoginModel

# Setup the in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

# Dependency override
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

def get_session_cookie():
    # Simulate a login to get a valid session_id cookie
    login_data = {
        "name": "admin1",  # Use admin credentials for simplicity
        "password": "aac-rotaract-admin"
    }
    response = client.post("/admin-login", json=login_data)
    assert response.status_code == 200
    return response.cookies.get("session_id")

def test_create_student():
    # Get a valid session_id
    session_id = get_session_cookie()

    # Create a student with the session_id in cookies
    student_data = {
        "roll_no": "12345",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "gender": "Male",
        "dept": "CS",
        "startYear": 2021,
        "endYear": 2025,
        "mobileNo": "1234567890"
    }
    response = client.post("/students/", json=student_data, cookies={"session_id": session_id})
    assert response.status_code == 200
    assert response.json()["email"] == "john.doe@example.com"

def test_get_students():
    # Get a valid session_id
    session_id = get_session_cookie()

    # Fetch all students with the session_id in cookies
    response = client.get("/students/", cookies={"session_id": session_id})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_student_by_id():
    # Get a valid session_id
    session_id = get_session_cookie()
    #
    # # First, create a student to retrieve
    # student_data = {
    #     "roll_no": "123452",
    #     "name": "John Doe2",
    #     "email": "john2.doe@example.com",
    #     "gender": "Male",
    #     "dept": "CS",
    #     "startYear": 2021,
    #     "endYear": 2025,
    #     "mobileNo": "1234567890"
    # }
    # create_response = client.post("/students/", json=student_data, cookies={"session_id": session_id})
    student_id = 1

    # Retrieve the student by ID
    response = client.get(f"/students/{student_id}", cookies={"session_id": session_id})
    assert response.status_code == 200
    assert response.json()["email"] == "john.doe@example.com"

def test_update_student():
    # Get a valid session_id
    session_id = get_session_cookie()

    # First, create a student to update
    student_data = {
        "roll_no": "123456",
        "name": "John Doe6",
        "email": "john6.doe@example.com",
        "gender": "Male",
        "dept": "CS",
        "startYear": 2021,
        "endYear": 2025,
        "mobileNo": "1234567890"
    }
    create_response = client.post("/students/", json=student_data, cookies={"session_id": session_id})
    student_id = create_response.json()["id"]

    # Update the student
    update_data = {
        "id": student_id,  # Include the student_id in the update data
        "roll_no": "123456",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "gender": "Male",
        "dept": "CS",
        "startYear": 2021,
        "endYear": 2025,
        "mobileNo": "1234567890"
    }
    response = client.put(f"/students/{student_id}", json=update_data, cookies={"session_id": session_id})
    assert response.status_code == 200
    assert response.json()["name"] == "Jane Doe"
    assert response.json()["email"] == "jane.doe@example.com"

def test_delete_student():
    # Get a valid session_id
    session_id = get_session_cookie()

    # First, create a student to delete
    student_data = {
        "roll_no": "123457",
        "name": "John Doe7",
        "email": "john7.doe@example.com",
        "gender": "Male",
        "dept": "CS",
        "startYear": 2021,
        "endYear": 2025,
        "mobileNo": "1234567890"
    }
    create_response = client.post("/students/", json=student_data, cookies={"session_id": session_id})
    student_id = create_response.json()["id"]

    # Delete the student
    response = client.delete(f"/students/{student_id}", cookies={"session_id": session_id})
    assert response.status_code == 200
    assert response.json()["message"] == "Student deleted successfully"

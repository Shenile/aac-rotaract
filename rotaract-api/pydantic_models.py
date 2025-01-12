
from pydantic import BaseModel
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

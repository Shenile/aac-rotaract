from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Rotaract_Students(Base):
    __tablename__ = "rotaract_students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    roll_no = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(50), index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    gender = Column(String(10))
    dept = Column(String(100))
    startYear = Column(Integer, nullable=False)
    endYear = Column(Integer, nullable=True)
    mobileNo = Column(String(15), nullable=True)

    def __repr__(self):
        return (
            f"<RotaractStudents(id={self.id}, roll_no='{self.roll_no}', "
            f"name='{self.name}', email='{self.email}')>"
        )

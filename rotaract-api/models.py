from sqlalchemy import Column, Integer, String
from db import Base


class Rotaract_Students(Base):
    __tablename__ = "Rotaract_Students"


    id = Column(Integer, primary_key=True, index=True)
    roll_no = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    gender = Column(String)
    dept = Column(String)
    startYear = Column(Integer)
    endYear = Column(Integer)
    mobileNo = Column(String)

    def __repr__(self):
        return f"<Rotaract_Students(id={self.id}, roll_no={self.roll_no}, name={self.name}, email={self.email})>"

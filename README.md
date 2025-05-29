# **Rotaract Club of Arul Anandar College - Student Data Management System**

## **Vision**
The Rotaract Club of Arul Anandar College envisions itself as a unit of an International Youth Organisation that supports and promotes youth to play a vital role in the development of society.

## **Mission**
Our mission is to encourage our members to become responsible citizens and competent leaders in the future.

## **Objectives**
- Familiarize students with the Vision and Mission of the Rotaract Club.
- Understand the role of youth in transforming society.
- Promote awareness of the social responsibility of youth.
- Enable students to become responsible citizens.
- Help students explore their role as global citizens.

The Rotaract Club of Arul Anandar College has conducted various programs vital to nation-building. We have organized orientation programs in collaboration with the Rotary Club of Madurai North West, and awareness programs on social issues like women’s participation in politics, transgender rights, and more. These programs have made a significant impact in the community.

## **Project Overview**
This project, **Rotaract Club Student Data Management System**, was developed to manage the data of club members and events efficiently. Previously, the club had to manually write and maintain records, which was time-consuming and prone to errors. This system modernizes the process, providing a web-based solution for seamless data management.

## **Core Features**
1. **Student Data Management**  
   - Manage student data efficiently and securely.
   - Features like adding, updating, and deleting student records.
   - Option to upload student data in Excel format for easy importation and processing.

2. **Filter Options**  
   - Search and filter data based on specific criteria (e.g., student name, course, etc.).

3. **PDF Generation**  
   - Generate reports of student data and events in a well-formatted PDF document.

4. **Admin Features**  
   - Admin panel to manage student data, view reports, and perform data updates.
   - Admin can delete all records if necessary.

5. **Student Features**  
   - Students can log in and manage their profiles (view, update personal data).
   - Modern, responsive design tailored for both mobile and desktop versions.
   - Easy navigation and user-friendly interface.

## **Tech Stack**
- **Frontend:** React.js with Vite, Tailwind CSS
- **Backend:** FastAPI
- **Database:** MySQL
- **ORM:** SQLAlchemy
- **PDF Generation:** reportlab
- **Excel File Processing:** `openpyxl` or similar library for Excel file imports

## **Installation and Setup**

### 1. **Frontend Setup (React with Vite)**
   - Clone the repository:
     ```bash
     git clone <repository_url>
     cd <project_folder>
     ```
   - Install frontend dependencies:
     ```bash
     npm install
     ```
   - Run the development server:
     ```bash
     npm run dev
     ```

   - Open your browser and navigate to `http://localhost:5173` (default port for Vite).

### 2. **Backend Setup (FastAPI)**
   - Clone the backend repository (if it's in a separate folder):
     ```bash
     git clone <backend_repository_url>
     cd <backend_folder>
     ```
   - Create a virtual environment (optional but recommended):
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows, use venv\Scripts\activate
     ```
   - Install backend dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the FastAPI server:
     ```bash
     uvicorn main:app --reload
     ```

   - The FastAPI server should now be running at `http://localhost:8000`.

### 3. **MySQL Database Setup**
   - Make sure you have MySQL installed and running.
   - Create a new database for the project:
     ```sql
     CREATE DATABASE rotaract_db;
     ```
   - Set up the database tables using SQLAlchemy ORM (refer to backend documentation for table setup and migrations).

### 4. **Connecting Frontend and Backend**
   - Make sure your frontend (React) is configured to make requests to the backend (FastAPI). Update the API base URL in your frontend configuration if necessary.

### 5. **Running the Full Application**
   - After setting up the frontend, backend, and database, ensure both servers (Vite and FastAPI) are running concurrently:
     - Vite frontend at `http://localhost:5173`
     - FastAPI backend at `http://localhost:8000`

## **Usage**
- **Admin Login:** Admin can log in using the designated credentials and manage all aspects of the system, including student data and events.
- **Student Login:** Students can log in to manage their personal profile information and view events or announcements.

## **PDF Generation**
- The system provides functionality to generate formatted PDFs for student data and event reports.
- Admin can download and view student records and reports in PDF format.

## **Excel File Upload**
- Students or Admin can upload an Excel file to add multiple records at once.
- The system will process the data and update the database accordingly.

## **Demo Screenshots**
*/homepage*
![image](https://github.com/user-attachments/assets/dfdae901-f47c-4af3-98d7-172988c46459)

*/admin-dashboard*
![image](https://github.com/user-attachments/assets/eb75a2b7-5fba-408f-945c-e3ba619c1ca5)

*/student-profile*
![image](https://github.com/user-attachments/assets/06fe41e0-4fbf-43d7-acfe-defdaf03e917)

*/login-page*
![image](https://github.com/user-attachments/assets/d52f5e58-87c3-4c12-9602-591b579ce76b)


## **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


import axios from 'axios';


const API_URL = 'http://localhost:8000'; 

export const registerStudent = async (studentData) => {
    try {
        const response = await axios.post(`${API_URL}/students/`, studentData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};

export const generatePDF = async (data) => {
    try {
        // Send POST request with data to generate the PDF
        const response = await axios.post(`${API_URL}/generate-doc`, 
            { data, type: 'pdf' }, 
            { 
                responseType: 'blob',  // Ensure the response is treated as a Blob (binary data)
            }
        );

        return response.data;  // Return the blob data (PDF)
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;  // Propagate error if needed
    }
};


export const getStudentRecords = async () => {
    try {

        const res = await axios.get(`${API_URL}/students/`)
        return res.data;

    } catch (err) {
        console.error('Error Getting Student Data:', err);
        throw err;
    }
};

export const getStudentRecord = async (id) => {
    try {

        const res = await axios.get(`${API_URL}/students/${id}`)
        return res.data;

    } catch (err) {
        console.error('Error Getting Student Data:', err);
        throw err;
    }
}

export const updateStudentRecord = async (data) => {
    try {

        const response = await axios.put(`${API_URL}/students/${data.id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;

    } catch (err) {
        console.error('Error Getting Student Data:', err);
        throw err;
    }
}

export const deleteStudentRecord = async (id) => {
    try {

        const response = await axios.delete(`${API_URL}/students/${id}`);
        return response.data;

    } catch (err) {
        console.error('Error Getting Student Data:', err);
        throw err;
    }
}

export const deleteAllStudents = async () => {
    try {
        // Make the DELETE request to the backend API
        const response = await axios.delete(`${API_URL}/students/`);
        return response.data; // Return the response data
    } catch (err) {
        // Log the error details for debugging
        console.error('Error deleting student records:', err.response?.data || err.message);
        throw err; // Rethrow the error to handle it in the calling code
    }
};
export const studentLogin = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/student-login`, loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Success: returns "Login successful"
    } catch (error) {
        console.error('Error logging in student:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const adminLogin = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/admin-login`, loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Success: returns "Login successful"
    } catch (error) {
        console.error('Error logging in admin:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const uploadFile = async (file) => {
    try {
      // Create a new FormData object to send the file as multipart/form-data
      const formData = new FormData();
      formData.append("file", file);  // 'file' is the name of the field in your FastAPI endpoint
  
      // Send the request with the FormData object
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
    
      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };


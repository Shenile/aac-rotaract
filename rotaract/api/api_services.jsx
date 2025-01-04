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

export const getStudentRecords = async () => {
    try {

        const res = await axios.get(`${API_URL}/students/`)
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


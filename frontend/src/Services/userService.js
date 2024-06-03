import axios from 'axios';

class UserService {
    constructor() {
        this.apiUrl = 'http://localhost:8080/user'; // Your API base URL
    }

    getAllUsers() {
        return axios.get(`${this.apiUrl}/all`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching all users:', error);
                throw error;
            });
    }

    getUserById(id) {
        return axios.get(`${this.apiUrl}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching user by ID:', error);
                throw error;
            });
    }

    createUser(user) {
        return axios.post(this.apiUrl, user)
            .then(response => response.data)
            .catch(error => {
                console.error('Error creating user:', error);
                throw error;
            });
    }

    updateUser(id, user) {
        return axios.put(`${this.apiUrl}/${id}`, user)
            .then(response => response.data)
            .catch(error => {
                console.error('Error updating user:', error);
                throw error;
            });
    }

    deleteUser(id) {
        return axios.delete(`${this.apiUrl}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error deleting user:', error);
                throw error;
            });
    }

    getCurrentUser() {
        const token = localStorage.getItem('jwtToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        return axios.get(`${this.apiUrl}/current`, config)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching current user:', error);
                throw error;
            });
    }
}

export default UserService;

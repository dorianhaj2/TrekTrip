import axiosInstance from "../axios/axiosInstance";

class userService {
    constructor() {
        this.apiUrl = '/user';
    }

    getAllUsers() {
        return axiosInstance.get(`${this.apiUrl}/all`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching all users:', error);
                throw error;
            });
    }

    getUserById(id) {
        return axiosInstance.get(`${this.apiUrl}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching user by ID:', error);
                throw error;
            });
    }

    getUserByUsername(username) {
        return this.getAllUsers()
            .then(users => users.find(user => user.username === username))
            .catch(error => {
                console.error('Error fetching user by username:', error);
                throw error;
            });
    }
    
    createUser(user) {
        return axiosInstance.post(this.apiUrl, user)
            .then(response => response.data)
            .catch(error => {
                console.error('Error creating user:', error);
                throw error;
            });
    }

    updateUser(id, user) {
        return axiosInstance.put(`${this.apiUrl}/${id}`, user)
            .then(response => response.data)
            .catch(error => {
                console.error('Error updating user:', error);
                throw error;
            });
    }

    deleteUser(id) {
        return axiosInstance.delete(`${this.apiUrl}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error deleting user:', error);
                throw error;
            });
    }

    getCurrentUser() {
        return axiosInstance.get(`${this.apiUrl}/current`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching current user:', error);
                throw error;
            });
    }
}

export default userService;

import axios from 'axios';

class LoginService {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api';
    }

    authenticate(userCredentials) {
        return axios.post(`${this.apiUrl}/authenticate`, userCredentials)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }

    logout() {
        localStorage.removeItem('jwtToken'); 
    }
}

export default LoginService;

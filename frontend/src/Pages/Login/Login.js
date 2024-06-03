import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  axios.defaults.baseURL = 'http://localhost:8080';
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [authenticating, setAuthenticating] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthenticating(true);
    setLoginFailed(false);
    setError('');

    const { username, password } = formData;

    try {
        const response = await axios.post('/auth/login', { username, password });
        
        const accessToken = response.data.accessToken;
        
        const  authToken  = response.data.token;

        login(authToken)

        console.log(authToken)
        
        // Save the encoded token to localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', accessToken);
        
        navigate('/');
    } catch (error) {
        // Handle login error
        if (error.response) {
          // Server responded with a status code outside of 2xx
          console.error('Login failed:', error.response.data);
          setError("Molimo provjerite podatke")
      } else if (error.request) {
          // Request made but no response received
          console.error('No response received:', error.request);
      } else {
          // Something else went wrong
          console.error('Error during login:', error.message);
      }
      setLoginFailed(true);
    } finally {
      setAuthenticating(false); // Re-enable inputs
    }

};
  

    return (

<div className="auth-container">
<div className='logo-text'>
  <p>TrekTrip</p>
</div>
<form className="auth-form" onSubmit={handleSubmit}>
  <h1 className='auth-title'>PRIJAVA</h1>
  <label>
    Korisničko ime
    <input
      type="text"
      id="username"
      name="username"
      className="form-control"
      placeholder="Unesite korisničko ime"
      value={formData.username}
      onChange={handleChange}
      required
      disabled={authenticating}
    />
  </label>
  <label>
    Lozinka
    <input
      type="password"
      id="password"
      name="password"
      className="form-control"
      placeholder="Unesite lozinku"
      value={formData.password}
      onChange={handleChange}
      required
      disabled={authenticating}
    />
  </label>
  <div className='remember'>
    <label className="auth-checkbox">
      <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
      Zapamti me
    </label>
    <p>Zaboravljena lozinka?</p>
  </div>
  <button
    type="submit"
    className="auth-submit"
    disabled={!formData.username || !formData.password || authenticating}
  >
    Prijava
    {authenticating && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>}
  </button>
  {loginFailed && <div className="alert alert-danger mt-3">Prijava nije uspjela. Pokušajte ponovo.</div>}
  <p>Nemate račun? <Link to="/registracija">Registracija</Link></p>
  {error && <p className="error">{error}</p>}
</form>
</div>
    );
};

export default Login;

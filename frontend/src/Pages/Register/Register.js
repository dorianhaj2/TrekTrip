import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';
import '../Login/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const [registering, setRegistering] = useState(false);
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    // Check if passwords match
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      setRegistering(false);
      return;
    }

    try {
      // Send POST request to register user
      const response = await axios.post('/user/register', formData);
      
      console.log('Registration successful:', response.data);
      // Redirect user to login page after successful registration
      navigate('/prijava');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again later.');
      setRegistrationFailed(true);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">REGISTRACIJA</h1>
        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Korisničko ime
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          Lozinka
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <label>
          Ponovite lozinku
          <input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} required />
        </label>
        <button
          type="submit"
          className="auth-submit"
          disabled={!formData.username || !formData.email || !formData.password || !formData.repeatPassword || registering}
        >
          PODNESI
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;

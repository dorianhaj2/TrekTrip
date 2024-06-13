import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    
    /*const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
          await login(email, password)
          navigate('/')
        } catch (error) {
          console.log(error);
          setError(error.message)
        }
      };*/

    const loginImage = process.env.PUBLIC_URL + '/Login.jpg'

  return (
    <div className="auth-container">
      <div className='logo-text'>
        <p>TrekTrip</p>
      </div>
      <form className="auth-form" /*onSubmit={handleSubmit}*/>
        <h1 className='auth-title'>PRIJAVA</h1>
        <label>
          Email
          <input type="email" name="email" /*value={formData.email} onChange={handleChange} */required />
        </label>
        <label>
          Lozinka
          <input type="password" name="password" /*value={formData.password} onChange={handleChange} */required />
        </label>
        <div className='remember'>
          <label className="auth-checkbox">
            <input type="checkbox" name="rememberMe" /*checked={formData.rememberMe} onChange={handleChange} *//>
            Zapamti me
          </label>
          <p>Zaboravljena lozinka?</p>
        </div>
        <button type="submit" className="auth-submit">PRIJAVI SE</button>
        <p>Nemate račun? <Link to="/registracija">Registracija</Link></p>
      </form>
    </div>
  );
}

export default Login;

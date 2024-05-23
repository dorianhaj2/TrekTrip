import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'

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
    <div className="login-page">
        <form className="form" /*onSubmit={handleSubmit}*/>
          <h1 className='auth_title'>PRIJAVA</h1>
          <label>
            Email
            <input type="email" name="email" /*value={formData.email} onChange={handleChange} */required />
          </label>
          <label>
            Lozinka
            <input type="password" name="password" /*value={formData.password} onChange={handleChange} */required />
          </label>
          <label className="remember-me-checkbox">
            <input type="checkbox" name="rememberMe" /*checked={formData.rememberMe} onChange={handleChange} *//>
            Zapamti me
          </label>
          <button type="submit" className="login-submit">PRIJAVI SE</button>
          <p>Nemate račun? <Link to="/registracija">Registracija</Link></p>
        </form>
    </div>
  )
}

export default Login
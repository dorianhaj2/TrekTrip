import React from 'react';
import '../Login/Auth.css';

const Register = () => {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="path_to_your_logo.png" alt="TrekTrip" className="auth-logo" />
      </div>
        <form className="auth-form" /*onSubmit={handleSubmit}*/>
          <h1 className='auth-title'>REGISTRACIJA</h1>
          <label>
            Email
            <input type="email" name="email" /*value={formData.email} onChange={handleChange} */required />
          </label>
          <label>
            Korisničko ime
            <input type="text" name="username" /*value={formData.username} onChange={handleChange} */required />
          </label>
          <label>
            Lozinka
            <input type="password" name="password" /*value={formData.password} onChange={handleChange} */required />
          </label>
          <label>
            Potvrdite lozinku
            <input type="password" name="confirmPassword" /*value={formData.confirmPassword} onChange={handleChange} */required />
          </label>
          <label className="auth-checkbox">
            <input type="checkbox" name="termsAccepted" /*checked={formData.termsAccepted} onChange={handleChange} */required />
            I agree to the Terms of service
          </label>
          <button type="submit" className="auth-submit">PODNESI</button>
        </form>
      </div>
  );
}

export default Register;

import React from 'react';
import './Register.css'

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-header">
        <img src="path_to_your_logo.png" alt="TrekTrip" className="register-logo" />
      </div>
      <div className="register-form-container">
        <form className="register-form" /*onSubmit={handleSubmit}*/>
          <h2>REGISTRACIJA</h2>
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
          <label className="terms-checkbox">
            <input type="checkbox" name="termsAccepted" /*checked={formData.termsAccepted} onChange={handleChange} */required />
            I agree to the Terms of service
          </label>
          <button type="submit" className="register-submit">PODNESI</button>
        </form>
      </div>
    </div>
  )
}

export default Register
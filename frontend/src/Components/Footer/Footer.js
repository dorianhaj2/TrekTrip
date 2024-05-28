import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className="footer">
      <div className='copyright'>
        <p>Copyright 2024 TrekTrip</p>
      </div>
      <div className="footer-links">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-conditions">Terms & Conditions</a>
        <a href="/cookie-policy">Cookie Policy</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  )
}

export default Footer
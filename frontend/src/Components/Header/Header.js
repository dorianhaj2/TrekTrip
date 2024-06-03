import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../Services/authService';
import axios from 'axios';
import axiosInstance from '../../axios/axiosInstance'; 
import { useNavigate } from 'react-router-dom';

import "./Header.css";

const Header = () => {

    const [activeButton, setActiveButton] = useState(null);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();


    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId);
        window.scroll(0, 0);
    };


    const handleLogout = async () => {
        
      
        try {
          // Retrieve the token from local storage
          const token = localStorage.getItem('authToken');
          console.log(token);
      
          // Proceed with the logout process
          await axiosInstance.post('/auth/logout', { token });
      
          // Clear the authentication token from local storage
          logout();
          navigate('/');
        } catch (error) {
          // Handle logout error
          console.error('Logout error:', error);
        }
      };
    
    
    
    
    /*const isTokenExpired = (token) => {
        console.log('Token:', token); // Check if the token is received
        if (!token) {
            console.log('Token is empty or undefined'); // Check if the token is empty or undefined
            return true;
        }
        const payload = token.split('.')[1];
        console.log(payload)
    if (!payload) {
        // Invalid token format
        return true;
    }
    try {
        // Decode the payload (not using JSON.parse)
        const decodedPayload = atob(payload);
        // Parse the decoded payload
        const { exp } = JSON.parse(decodedPayload);
        // Check if the expiration time is in the past
        const expiry = exp * 1000; // Convert to milliseconds
        const isExpired = Date.now() > expiry;
        return isExpired;
    } catch (error) {
        // Error parsing or decoding the payload
        console.error('Error:', error);
        return true; // Assume token is expired
    }
    };*/

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };


    return (
        <header className='header'>
            <span className="header_title">
                <Link to='/' onClick={() => handleButtonClick(1)}>
                    TrekTrip
                </Link>
            </span>
            <nav className="navbar">
                
                <Link to='/putovanja'>
                    <button className={`nav_button ${activeButton === 3 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(3)}>
                        Putovanja
                    </button>
                </Link>
                {isLoggedIn ? (
        <div
            className={`dropdown-container ${isDropdownOpen ? 'open' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to='/profil'>
                    <button className={`nav_button ${activeButton === 2 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(2)}>
                        Profil
                    </button>
                </Link>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <button className="nav_button" onClick={handleLogout}>
                Odjava
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/prijava">
          <button className="nav_button">
            Prijava
          </button>
        </Link>
      )}
            </nav>
        </header>  
    )
}

export default Header;

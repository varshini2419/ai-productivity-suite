// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logoai3.png';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <Link to="/" className="nav-logo">
            <div className="logo-wrapper">
              <img src={logo} alt="AICRAFT" className="nav-logo-img" />
              <div className="logo-glow-small"></div>
            </div>
            <span className="nav-brand">
              AICRAFT<span className="brand-highlight">SUITE</span>
            </span>
          </Link>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          </li>
         
          <li className="nav-item">
            <Link to="/resume-analyzer" className={`nav-link ${location.pathname === '/resume-analyzer' ? 'active' : ''}`}>Resume</Link>
          </li>
          <li className="nav-item">
            <Link to="/debate-arena" className={`nav-link ${location.pathname === '/debate-arena' ? 'active' : ''}`}>Debate</Link>
          </li>
          <li className="nav-item">
            <Link to="/interview-simulator" className={`nav-link ${location.pathname === '/interview-simulator' ? 'active' : ''}`}>Interview</Link>
          </li>
          <li className="nav-item">
            <Link to="/marketing-generator" className={`nav-link ${location.pathname === '/marketing-generator' ? 'active' : ''}`}>Marketing</Link>
          </li>
        </ul>

        <div className="nav-buttons">
          <button className="nav-btn-primary" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
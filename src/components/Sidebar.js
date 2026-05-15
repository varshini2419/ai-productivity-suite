// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logoai3.png';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    {
      path: '/',
      label: 'Home',
      icon: <i className="fas fa-home"></i>
    },
  
    { 
      path: '/resume-analyzer', 
      label: 'Resume Analyzer', 
      icon: <i className="fas fa-file-alt"></i> 
    },
    { 
      path: '/debate-arena', 
      label: 'Debate Arena', 
      icon: <i className="fas fa-comments"></i> 
    },
    { 
      path: '/interview-simulator', 
      label: 'Interview Simulator', 
      icon: <i className="fas fa-user-tie"></i> 
    },
    { 
      path: '/marketing-generator', 
      label: 'Marketing Generator', 
      icon: <i className="fas fa-bullhorn"></i> 
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <img src={logo} alt="AICRAFT" className="sidebar-logo" />
        <span className="sidebar-brand"><span className="brand-highlight">AICRAFT SUITE</span></span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
// src/components/Loader.js
import React from 'react';
import "../styles/global.css";

const Loader = ({ text = "AI is analyzing your input..." }) => {
  return (
    <div className="loader-container">
      <div className="ai-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{text}</p>
    </div>
  );
};

export default Loader;
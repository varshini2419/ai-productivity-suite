// src/pages/DebateArena/DebateArena.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/DebateArena.css';
import logo from '../../assets/logoai3.png';

const DebateArena = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [position, setPosition] = useState('for');
  const [error, setError] = useState('');

  const handleStartDebate = (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a debate topic');
      return;
    }

    navigate('/debate-arena/chat', { 
      state: { 
        topic: topic.trim(), 
        position 
      } 
    });
  };

  return (
    <div className="debate-arena-container">
      {/* Neural Network Background */}
      <div className="neural-bg">
        <div className="neural-grid"></div>
        <div className="neural-nodes"></div>
      </div>

      {/* Header with Logo */}
      <div className="debate-header">
        <div className="logo-wrapper">
          <img src={logo} alt="AICRAFT Logo" className="debate-logo" />
          <span className="debate-brand">AICRAFT SUITE</span>
        </div>
        <p className="debate-tagline">Innovate. Create. Empower.</p>
      </div>

      {/* Main Content */}
      <div className="debate-content">
        <div className="debate-title-section">
          <h1 className="debate-main-title">AI Debate Arena</h1>
          <p className="debate-subtitle">
            Practice real-time debates with AI to improve critical thinking, 
            communication, and argument skills.
          </p>
        </div>

        {/* Setup Card */}
        <div className="debate-setup-card glass-card">
          <div className="card-glow"></div>
          <form onSubmit={handleStartDebate} className="debate-form">
            <div className="form-group">
              <label htmlFor="topic" className="form-label">
                <span className="label-icon">🎯</span>
                Debate Topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Example: Should Artificial Intelligence replace human jobs?"
                className="debate-input futuristic-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⚔️</span>
                Choose Your Position
              </label>
              <div className="position-selector">
                <button
                  type="button"
                  className={`position-btn ${position === 'for' ? 'active for' : ''}`}
                  onClick={() => setPosition('for')}
                >
                  <span className="btn-glow"></span>
                  <span className="btn-icon">✓</span>
                  <span className="btn-text">FOR</span>
                </button>
                <button
                  type="button"
                  className={`position-btn ${position === 'against' ? 'active against' : ''}`}
                  onClick={() => setPosition('against')}
                >
                  <span className="btn-glow"></span>
                  <span className="btn-icon">✗</span>
                  <span className="btn-text">AGAINST</span>
                </button>
              </div>
            </div>

            {error && <div className="error-message glow-error">{error}</div>}

            <button type="submit" className="start-debate-btn">
              <span className="btn-text">Start Debate</span>
              <span className="btn-icon">→</span>
              <span className="btn-glow"></span>
            </button>
          </form>

          {/* Tech Stack Badge */}
          <div className="tech-stack-badge">
            <span className="tech-item">⚛️ React</span>
            <span className="tech-item">🧠 Groq AI</span>
            <span className="tech-item">⚡ Node.js</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateArena;
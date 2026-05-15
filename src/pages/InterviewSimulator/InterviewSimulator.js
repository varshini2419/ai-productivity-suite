// src/pages/InterviewSimulator/InterviewSimulator.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/InterviewSimulator.css'; // Updated import

const InterviewSimulator = () => {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState('');
  const [interviewType, setInterviewType] = useState('technical');
  const [error, setError] = useState('');

  const interviewTypes = [
    { value: 'technical', label: 'Technical Interview', icon: '💻' },
    { value: 'hr', label: 'HR Interview', icon: '👥' },
    { value: 'behavioral', label: 'Behavioral Interview', icon: '🧠' }
  ];

  const handleStartInterview = (e) => {
    e.preventDefault();
    
    if (!jobRole.trim()) {
      setError('Please enter a job role');
      return;
    }

    navigate('/interview-simulator/chat', { 
      state: { 
        jobRole: jobRole.trim(), 
        interviewType 
      } 
    });
  };

  return (
    <div className="interview-page-container">
      {/* Neural Background */}
      <div className="neural-bg">
        <div className="neural-grid"></div>
        <div className="neural-nodes"></div>
      </div>

      {/* Header */}
      <div className="interview-header">
        <h1>AI Interview Simulator</h1>
        <p className="page-description">
          Simulate real job interviews with AI-generated questions and receive 
          instant feedback to improve your responses.
        </p>
      </div>

      {/* Setup Card */}
      <div className="interview-setup-card glass-card">
        <div className="card-glow"></div>
        
        <form onSubmit={handleStartInterview} className="interview-form">
          <div className="form-group">
            <label htmlFor="jobRole">
              <span className="label-icon">🎯</span>
              Job Role
            </label>
            <input
              type="text"
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Frontend Developer, Data Analyst, Product Manager"
              className="interview-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="interviewType">
              <span className="label-icon">⚡</span>
              Interview Type
            </label>
            <select
              id="interviewType"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="interview-select"
            >
              {interviewTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preview selected type */}
          {interviewType && (
            <div className="interview-type-preview">
              <span className={`interview-type-badge ${interviewType}`}>
                {interviewTypes.find(t => t.value === interviewType)?.icon} {interviewTypes.find(t => t.value === interviewType)?.label}
              </span>
            </div>
          )}

          {error && <div className="error-message glow-error">{error}</div>}

          <button type="submit" className="start-interview-btn">
            <span className="btn-text">Start Interview</span>
            <span className="btn-icon">→</span>
            <span className="btn-glow"></span>
          </button>
        </form>

        {/* Features Badge */}
        <div className="tech-stack-badge">
          <span className="tech-item">⚛️ React</span>
          <span className="tech-item">🧠 AI-Powered</span>
          <span className="tech-item">📊 Real-time Feedback</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;
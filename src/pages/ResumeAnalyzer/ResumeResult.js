import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/ResumeAnalyzer.css';

const ResumeResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ❌ removed resumeText (unused)
  const { analysis, jobRole } = location.state || {};

  // ❌ removed activeTab, setActiveTab (unused)
  const [copied, setCopied] = useState(false);

  if (!analysis) {
    return (
      <div className="resume-analyzer-container modern">
        <div className="error-state-modern">
          <div className="error-icon-large">🔍</div>
          <h2 className="error-title">No Analysis Found</h2>
          <p className="error-message">Please analyze a resume first to see results.</p>
          <button onClick={() => navigate('/resume-analyzer')} className="back-button-primary">
            ← Back to Analyzer
          </button>
        </div>
      </div>
    );
  }

  const {
    score = 0,
    strengths = [],
    weaknesses = [],
    improvements = [],
    recommendedSkills = [],
    missingKeywords = []
  } = analysis;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Your resume is well-optimized for ATS and recruiters.';
    if (score >= 60) return 'Good resume with room for improvement.';
    return 'Needs significant optimization. Consider the suggestions below.';
  };

  const handleDownloadReport = () => {
    const reportData = {
      jobRole,
      score,
      strengths,
      weaknesses,
      improvements,
      recommendedSkills,
      missingKeywords,
      analyzedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${jobRole || 'report'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySuggestions = () => {
    const suggestions = improvements.join('\n• ');
    navigator.clipboard.writeText(suggestions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="resume-analyzer-container modern">
      <div className="results-header-modern">
        <div className="header-content">
          <button onClick={() => navigate('/resume-analyzer')} className="back-button">
            <span className="back-icon">←</span>
            Back to Analyzer
          </button>

          <div className="header-info">
            <h1 className="results-title">Resume Analysis Results</h1>
            <div className="job-role-tag">
              <span className="tag-icon">🎯</span>
              <span className="tag-text">{jobRole || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="score-section-modern">
        <div className="score-card-modern">
          <div className="score-circle-modern" style={{ borderColor: getScoreColor(score) }}>
            <div className="score-value">{score}</div>
            <div className="score-max">/100</div>
          </div>

          <div className="score-details">
            <h3 className="score-label">Overall Resume Score</h3>
            <p className="score-message" style={{ color: getScoreColor(score) }}>
              {getScoreMessage(score)}
            </p>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handleDownloadReport} className="action-btn secondary">
          📥 Download Report
        </button>

        <button onClick={handleCopySuggestions} className="action-btn secondary">
          {copied ? 'Copied!' : 'Copy Suggestions'}
        </button>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <h3>Strengths</h3>
          {strengths.length > 0 ? (
            strengths.map((item, i) => <p key={i}>{item}</p>)
          ) : (
            <p>No strengths identified</p>
          )}
        </div>

        <div className="result-card">
          <h3>Weaknesses</h3>
          {weaknesses.length > 0 ? (
            weaknesses.map((item, i) => <p key={i}>{item}</p>)
          ) : (
            <p>No weaknesses identified</p>
          )}
        </div>

        <div className="result-card">
          <h3>Missing Keywords</h3>
          {missingKeywords.length > 0 ? (
            missingKeywords.map((k, i) => <span key={i}>{k} </span>)
          ) : (
            <p>No missing keywords</p>
          )}
        </div>

        <div className="result-card">
          <h3>Suggestions</h3>
          {improvements.length > 0 ? (
            improvements.map((item, i) => <p key={i}>{item}</p>)
          ) : (
            <p>No suggestions</p>
          )}
        </div>

        <div className="result-card">
          <h3>Recommended Skills</h3>
          {recommendedSkills.length > 0 ? (
            recommendedSkills.map((skill, i) => <p key={i}>{skill}</p>)
          ) : (
            <p>No skills recommended</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeResult;
// src/pages/ResumeAnalyzer/ResumeAnalyzer.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ResumeAnalyzer.css';
import { extractTextFromPDFSimple as extractTextFromPDF } from '../../utils/simplePdfParser';
import { analyzeResume } from '../../services/aiService';

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [useTextArea, setUseTextArea] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [extractionProgress, setExtractionProgress] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileValidation(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileValidation(selectedFile);
  };

  const handleFileValidation = (selectedFile) => {
    setError('');
    setExtractionProgress('');
    
    if (!selectedFile) {
      setFile(null);
      setFileName('');
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setUseTextArea(false);
    setResumeText('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!useTextArea && !file) {
      setError('Please upload a resume file or paste your resume text');
      return;
    }
    
    if (useTextArea && !resumeText.trim()) {
      setError('Please paste your resume content');
      return;
    }
    
    if (!jobRole.trim()) {
      setError('Please enter a job role');
      return;
    }

    setLoading(true);
    setError('');
    setExtractionProgress('');

    try {
      let textToAnalyze = '';
      
      if (useTextArea) {
        textToAnalyze = resumeText.trim();
        setExtractionProgress('Analyzing your resume text...');
      } else {
        setExtractionProgress('Reading PDF file...');
        textToAnalyze = await extractTextFromPDF(file);
        setExtractionProgress('PDF processed! AI is analyzing your resume...');
      }
      
      if (!textToAnalyze || textToAnalyze.trim().length < 50) {
        throw new Error('Could not extract enough text. Please ensure your resume has at least 50 characters of readable content.');
      }

      const result = await analyzeResume(textToAnalyze, jobRole);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze resume');
      }

      navigate('/resume-analyzer/result', { 
        state: { 
          analysis: result.data,
          jobRole: jobRole.trim(),
          resumeText: textToAnalyze.substring(0, 1000)
        } 
      });
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
      setExtractionProgress('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName('');
    setResumeText('');
    setJobRole('');
    setError('');
    setUseTextArea(false);
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <div className="resume-analyzer-container modern">
        <div className="loading-wrapper">
          <div className="loading-card">
            <div className="ai-loader-modern">
              <div className="loader-ring"></div>
              <div className="loader-core"></div>
            </div>
            <h3 className="loading-title">AI Analysis in Progress</h3>
            <p className="loading-message">{extractionProgress || "Processing your resume..."}</p>
            <div className="loading-steps">
              <div className="step active">📄 Extracting</div>
              <div className="step">🔍 Analyzing</div>
              <div className="step">📊 Scoring</div>
              <div className="step">✨ Generating</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-analyzer-container modern">
      {/* Header */}
      <div className="analyzer-header-modern">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-icon">📄</div>
            <div>
              <h1 className="header-title">Resume Analyzer</h1>
              <p className="header-subtitle">Get instant feedback on your resume using AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Visual Hint */}
      <div className="workflow-hint">
        <div className="workflow-step">
          <span className="step-icon">📤</span>
          <span>Upload Resume</span>
        </div>
        <div className="workflow-arrow">→</div>
        <div className="workflow-step">
          <span className="step-icon">🧠</span>
          <span>AI Analysis</span>
        </div>
        <div className="workflow-arrow">→</div>
        <div className="workflow-step">
          <span className="step-icon">📊</span>
          <span>Results</span>
        </div>
      </div>

      {/* Main Container - 2 Column Layout */}
      <div className="analyzer-main">
        {/* LEFT SIDE - Input Section */}
        <div className="input-section">
          <div className="section-card">
            <div className="card-header">
              <span className="card-icon">✏️</span>
              <h3 className="card-title">Input Resume</h3>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Toggle between Upload and Text Area */}
              <div className="input-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${!useTextArea ? 'active' : ''}`}
                  onClick={() => {
                    setUseTextArea(false);
                    setResumeText('');
                    setError('');
                  }}
                >
                  📄 Upload PDF
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${useTextArea ? 'active' : ''}`}
                  onClick={() => {
                    setUseTextArea(true);
                    setFile(null);
                    setFileName('');
                    setError('');
                  }}
                >
                  📝 Paste Text
                </button>
              </div>

              {/* File Upload Area */}
              {!useTextArea ? (
                <div 
                  className={`upload-area ${dragActive ? 'drag-active' : ''} ${fileName ? 'has-file' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="file-input-hidden"
                  />
                  
                  {fileName ? (
                    <div className="file-info-card">
                      <div className="file-preview">
                        <div className="file-icon-large">📄</div>
                        <div className="file-details">
                          <span className="file-name">{fileName}</span>
                          <span className="file-size">
                            {file && (file.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                        <button 
                          type="button" 
                          className="remove-file"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder" onClick={() => document.getElementById('resume-upload').click()}>
                      <div className="upload-icon-large">📤</div>
                      <div className="upload-text">
                        <span className="upload-main">Click to browse or drag and drop</span>
                        <span className="upload-sub">PDF files only (Max 5MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="textarea-wrapper">
                  <textarea
                    className="resume-textarea"
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows="12"
                  />
                  <div className="textarea-hint">
                    <span className="hint-icon">💡</span>
                    <span>Include skills, experience, education, and achievements</span>
                  </div>
                </div>
              )}

              {/* Job Role Input */}
              <div className="job-role-wrapper">
                <label className="input-label">
                  <span className="label-icon">🎯</span>
                  Target Job Role
                </label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g., Frontend Developer, Product Manager, Data Scientist"
                  className="job-role-input"
                />
                <small className="input-hint">
                  Be specific for better analysis results
                </small>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-alert">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-text">{error}</span>
                </div>
              )}

              {/* Analyze Button */}
              <button 
                type="submit" 
                className="analyze-button"
                disabled={loading}
              >
                <span className="button-icon">✨</span>
                <span className="button-text">Analyze Resume</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE - Output Section Preview */}
        <div className="output-section">
          <div className="section-card preview-card">
            <div className="card-header">
              <span className="card-icon">📊</span>
              <h3 className="card-title">Analysis Preview</h3>
            </div>
            
            <div className="preview-placeholder">
              <div className="placeholder-icon">🤖</div>
              <p className="placeholder-title">Ready for Analysis</p>
              <p className="placeholder-text">
                Upload your resume and click "Analyze Resume" to see:<br />
                • Overall Score<br />
                • Key Strengths<br />
                • Areas for Improvement<br />
                • ATS Keyword Analysis<br />
                • Skill Recommendations
              </p>
            </div>

            {/* Features List */}
            <div className="features-grid">
              <div className="feature-chip">
                <span className="chip-icon">✓</span>
                <span>ATS Compatibility</span>
              </div>
              <div className="feature-chip">
                <span className="chip-icon">✓</span>
                <span>Skill Gap Analysis</span>
              </div>
              <div className="feature-chip">
                <span className="chip-icon">✓</span>
                <span>Keyword Optimization</span>
              </div>
              <div className="feature-chip">
                <span className="chip-icon">✓</span>
                <span>Improvement Tips</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
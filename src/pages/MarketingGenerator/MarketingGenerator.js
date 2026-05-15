// src/pages/MarketingGenerator/MarketingGenerator.js
import React, { useState } from 'react';
import '../../styles/MarketingGenerator.css';
import logo from '../../assets/logoai3.png';
import { generateMarketingContent } from '../../services/aiService';

const MarketingGenerator = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    productName: '',
    targetAudience: '',
    marketingType: 'instagram'
  });
  
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const marketingTypes = [
    { value: 'instagram', label: '📱 Instagram Caption' },
    { value: 'facebook', label: '📘 Facebook Ad Copy' },
    { value: 'product', label: '📦 Product Description' },
    { value: 'email', label: '✉️ Email Marketing Copy' }
  ];

  const marketingTips = [
    { icon: '🎯', tip: 'Use emotional hooks to connect with your audience' },
    { icon: '✨', tip: 'Highlight key product benefits clearly' },
    { icon: '🔔', tip: 'Include a strong call-to-action' },
    { icon: '📝', tip: 'Keep captions concise and engaging' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async () => {
    // Validate form
    if (!formData.businessName.trim()) {
      setError('Please enter your business name');
      return;
    }
    if (!formData.productName.trim()) {
      setError('Please enter your product/service name');
      return;
    }
    if (!formData.targetAudience.trim()) {
      setError('Please enter your target audience');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await generateMarketingContent({
        businessName: formData.businessName,
        productName: formData.productName,
        targetAudience: formData.targetAudience,
        marketingType: formData.marketingType
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate content');
      }

      setGeneratedContent({
        content: response.data.content,
        type: formData.marketingType,
        prompt: `Create a ${marketingTypes.find(t => t.value === formData.marketingType)?.label} for: 
Business: ${formData.businessName} 
Product/Service: ${formData.productName} 
Target Audience: ${formData.targetAudience} 
Make it engaging, professional, and optimized for conversion.`
      });
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      businessName: '',
      productName: '',
      targetAudience: '',
      marketingType: 'instagram'
    });
    setGeneratedContent(null);
    setError('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (generatedContent?.content) {
      navigator.clipboard.writeText(generatedContent.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="marketing-generator">
      {/* Neural Network Background */}
      <div className="neural-bg">
        <div className="neural-grid"></div>
        <div className="neural-nodes"></div>
      </div>

      {/* Header Section */}
      <div className="generator-header">
        <div className="logo-section">
          <img src={logo} alt="AICRAFT Logo" className="header-logo" />
          <div className="brand-text">
            <h1 className="brand-name">AICRAFT SUITE</h1>
            <p className="brand-tagline">Innovate. Create. Empower.</p>
          </div>
        </div>
        <div className="title-section">
          <h2 className="page-title">AI Marketing Generator</h2>
          <p className="page-subtitle">
            Generate high-quality marketing captions, ads, and promotional content 
            instantly using AI.
          </p>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="generator-content">
        {/* Left Panel - Input Form */}
        <div className="input-panel glass-card">
          <div className="panel-header">
            <span className="panel-icon">📝</span>
            <h3 className="panel-title">Marketing Details</h3>
          </div>
          
          <div className="marketing-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏢</span>
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Example: NutriDelight"
                className="futuristic-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📦</span>
                Product / Service Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Example: Fresh Fruit Juices"
                className="futuristic-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👥</span>
                Target Audience
              </label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="Example: Health-conscious people in Bhimavaram"
                className="futuristic-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎨</span>
                Marketing Type
              </label>
              <select
                name="marketingType"
                value={formData.marketingType}
                onChange={handleInputChange}
                className="futuristic-select"
              >
                {marketingTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="button-group">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="generate-btn primary"
              >
                {loading ? (
                  <>
                    <span className="btn-loader"></span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    <span>Generate Content</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleClear}
                className="generate-btn secondary"
              >
                <span className="btn-icon">🗑️</span>
                <span>Clear Form</span>
              </button>
            </div>
          </div>

          {/* Marketing Tips */}
          <div className="marketing-tips">
            <h4 className="tips-title">
              <span className="tips-icon">💡</span>
              Pro Marketing Tips
            </h4>
            <div className="tips-grid">
              {marketingTips.map((item, index) => (
                <div key={index} className="tip-item">
                  <span className="tip-icon">{item.icon}</span>
                  <span className="tip-text">{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Generated Content */}
        <div className="output-panel glass-card">
          <div className="panel-header">
            <span className="panel-icon">🎯</span>
            <h3 className="panel-title">Generated Content</h3>
          </div>

          <div className="content-display">
            {loading ? (
              /* Loading State */
              <div className="loading-state">
                <div className="ai-loader">
                  <div className="loader-orb"></div>
                  <div className="loader-pulse"></div>
                </div>
                <p className="loading-text">AI is crafting your marketing content...</p>
              </div>
            ) : generatedContent ? (
              /* Result State */
              <div className="result-state">
                <div className="content-header">
                  <span className="content-type-badge">
                    {marketingTypes.find(t => t.value === generatedContent.type)?.label}
                  </span>
                  <button 
                    className="copy-btn"
                    onClick={handleCopy}
                  >
                    <span className="btn-icon">{copied ? '✅' : '📋'}</span>
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="prompt-section">
                  <h4 className="section-label">PROMPT USED</h4>
                  <div className="prompt-content">
                    {generatedContent.prompt}
                  </div>
                </div>

                <div className="generated-content-section">
                  <h4 className="section-label">GENERATED CONTENT</h4>
                  <div className="generated-content-box">
                    {generatedContent.content.split('\n').map((line, i) => (
                      <p key={i}>{line || <br />}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="empty-state">
                <div className="empty-icon">📢</div>
                <h4 className="empty-title">Ready to Create</h4>
                <p className="empty-message">
                  Fill in the form and click Generate to create AI-powered marketing content
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack Badge */}
      <div className="tech-stack-badge">
        <span className="tech-item">⚛️ React.js</span>
        <span className="tech-item">🧠 Groq AI</span>
        <span className="tech-item">⚡ Node.js</span>
        <span className="tech-item">🎨 Modern UI</span>
      </div>
    </div>
  );
};

export default MarketingGenerator;
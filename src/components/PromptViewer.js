// src/components/PromptViewer.js
import React, { useState } from 'react';
import '../styles/global.css';

const PromptViewer = ({ prompt, response }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof response === 'string' ? response : JSON.stringify(response, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderResponse = () => {
    if (!response) return 'No response available';
    
    if (typeof response === 'string') {
      return response;
    }
    
    if (typeof response === 'object') {
      if (response.data) {
        if (typeof response.data === 'string') {
          return response.data;
        }
        return <pre className="json-response">{JSON.stringify(response.data, null, 2)}</pre>;
      }
      return <pre className="json-response">{JSON.stringify(response, null, 2)}</pre>;
    }
    
    return String(response);
  };

  return (
    <div className="prompt-viewer">
      <div className="prompt-section">
        <h3 className="section-title">Prompt</h3>
        <div className="prompt-content">{prompt || 'No prompt available'}</div>
      </div>

      <div className="response-section">
        <div className="response-header">
          <h3 className="section-title">Response</h3>
          <button className="copy-button" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="response-content">
          {renderResponse()}
        </div>
      </div>
    </div>
  );
};

export default PromptViewer;
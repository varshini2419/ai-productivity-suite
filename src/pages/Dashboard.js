// src/pages/Dashboard.js
import React, { useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // State for each tool
  const [resumeInput, setResumeInput] = useState('');
  const [resumeOutput, setResumeOutput] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);

  const [interviewInput, setInterviewInput] = useState('');
  const [interviewOutput, setInterviewOutput] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);

  const [debateInput, setDebateInput] = useState('');
  const [debateOutput, setDebateOutput] = useState('');
  const [debateLoading, setDebateLoading] = useState(false);

  const [ideaInput, setIdeaInput] = useState('');
  const [ideaOutput, setIdeaOutput] = useState('');
  const [ideaLoading, setIdeaLoading] = useState(false);

  // Simulated AI Functions
  const analyzeResume = (text) => {
    if (!text.trim()) {
      return "⚠️ Please paste your resume content or skills to analyze.";
    }
    
    const lower = text.toLowerCase();
    const suggestions = [];
    
    // Skills detection
    if (lower.includes('react') || lower.includes('javascript') || lower.includes('python')) {
      suggestions.push("✅ Strong technical skills detected! Consider adding project links.");
    }
    if (lower.includes('manager') || lower.includes('lead') || lower.includes('director')) {
      suggestions.push("📊 Leadership experience noted. Quantify team size and achievements.");
    }
    if (lower.includes('marketing') || lower.includes('seo') || lower.includes('content')) {
      suggestions.push("📈 Marketing skills identified. Add metrics like conversion rates or traffic growth.");
    }
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) {
      suggestions.push("🎨 Design skills recognized. Include portfolio link and tools used.");
    }
    
    // General suggestions
    if (suggestions.length === 0) {
      suggestions.push("💡 Use action verbs (Developed, Managed, Created) to start bullet points.");
      suggestions.push("📊 Include quantifiable achievements (e.g., 'Increased sales by 30%').");
    }
    
    suggestions.push("🎯 Tailor your resume to match the job description keywords.");
    suggestions.push("✨ Keep formatting clean and use consistent bullet points.");
    
    return suggestions.join('\n');
  };

  const generateInterviewQuestions = (role) => {
    if (!role.trim()) {
      return "💼 Please enter a job role to generate interview questions.";
    }
    
    const roleLower = role.toLowerCase();
    
    if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('web')) {
      return `🎤 Interview Questions for ${role}:\n\n1. How do you optimize React component performance?\n2. Explain the difference between virtual DOM and real DOM.\n3. Describe a challenging UI bug you solved.\n4. How do you ensure cross-browser compatibility?\n5. What's your approach to state management?`;
    }
    
    if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('api')) {
      return `🎤 Interview Questions for ${role}:\n\n1. How do you design scalable RESTful APIs?\n2. Explain database indexing and optimization.\n3. How do you handle authentication and security?\n4. Describe a complex backend problem you solved.\n5. What's your experience with cloud services?`;
    }
    
    if (roleLower.includes('product') || roleLower.includes('pm')) {
      return `🎤 Interview Questions for ${role}:\n\n1. How do you prioritize features with limited resources?\n2. Describe a product you launched from concept to market.\n3. How do you handle stakeholder disagreements?\n4. What metrics do you use to measure product success?\n5. Tell me about a time a product failed and what you learned.`;
    }
    
    if (roleLower.includes('data') || roleLower.includes('analyst') || roleLower.includes('science')) {
      return `🎤 Interview Questions for ${role}:\n\n1. How do you handle missing or inconsistent data?\n2. Explain a complex SQL query you've written.\n3. What's your approach to A/B testing?\n4. How do you communicate insights to non-technical stakeholders?\n5. Describe a data-driven decision that impacted business.`;
    }
    
    return `🎤 Interview Questions for ${role}:\n\n1. What excites you about working as a ${role}?\n2. Describe a challenging project you successfully completed.\n3. How do you stay updated with industry trends?\n4. Give an example of excellent teamwork.\n5. Where do you see yourself in 5 years?`;
  };

  const generateDebateArguments = (topic) => {
    if (!topic.trim()) {
      return "⚖️ Please enter a debate topic to generate arguments.";
    }
    
    const topicLower = topic.toLowerCase();
    let proArgs = [];
    let conArgs = [];
    
    if (topicLower.includes('ai') || topicLower.includes('artificial')) {
      proArgs = ["🚀 AI boosts productivity and automates repetitive tasks", "📈 Enhances medical diagnosis and scientific research", "🌍 Enables personalized learning and education"];
      conArgs = ["⚠️ Risk of job displacement and economic inequality", "🔒 Privacy concerns and data security issues", "🎭 Potential for bias in AI decision-making"];
    } 
    else if (topicLower.includes('remote') || topicLower.includes('work from home')) {
      proArgs = ["🏠 Better work-life balance and flexibility", "🌎 Access to global talent without relocation", "💰 Reduced office costs and commuting time"];
      conArgs = ["😐 Reduced spontaneous collaboration and culture", "📉 Potential for isolation and burnout", "🏢 Challenges in team building and mentorship"];
    }
    else if (topicLower.includes('climate') || topicLower.includes('environment')) {
      proArgs = ["🌱 Renewable energy creates sustainable future", "🌊 Innovation in green technology", "🤝 International cooperation on climate goals"];
      conArgs = ["⏳ High initial costs and infrastructure changes", "📊 Economic impact on traditional industries", "🌍 Requires global coordination challenges"];
    }
    else if (topicLower.includes('social media')) {
      proArgs = ["📱 Connects people across distances", "💼 Platform for business and entrepreneurship", "📢 Amplifies voices and social causes"];
      conArgs = ["🧠 Mental health concerns and addiction", "🔐 Privacy and data exploitation issues", "❌ Spread of misinformation"];
    }
    else {
      proArgs = [`✅ ${topic} encourages innovation and progress`, `💡 Creates new opportunities and solutions`, `📈 Drives economic growth and development`];
      conArgs = [`❌ Potential ethical concerns to address`, `⚡ Implementation challenges exist`, `🤔 Requires careful regulation and oversight`];
    }
    
    return `🔵 PRO Arguments:\n${proArgs.map(arg => `• ${arg}`).join('\n')}\n\n🔴 CON Arguments:\n${conArgs.map(arg => `• ${arg}`).join('\n')}`;
  };

  const generateBusinessIdeas = (keyword) => {
    if (!keyword.trim()) {
      return "💡 Please enter a keyword to generate business ideas.";
    }
    
    const keywordLower = keyword.toLowerCase();
    const ideas = [];
    
    if (keywordLower.includes('ai') || keywordLower.includes('machine learning')) {
      ideas.push("🤖 AI-powered personal finance advisor app");
      ideas.push("📊 Automated resume screening platform for recruiters");
      ideas.push("🎓 AI tutoring system for personalized education");
      ideas.push("🏥 Healthcare diagnostic assistant using AI");
    }
    else if (keywordLower.includes('sustainable') || keywordLower.includes('eco') || keywordLower.includes('green')) {
      ideas.push("🌿 Zero-waste subscription box service");
      ideas.push("♻️ Marketplace for upcycled and sustainable products");
      ideas.push("📱 App tracking carbon footprint with offset suggestions");
      ideas.push("🌱 Plant-based meal planning service");
    }
    else if (keywordLower.includes('health') || keywordLower.includes('wellness') || keywordLower.includes('fitness')) {
      ideas.push("🧘 Virtual wellness coach with personalized plans");
      ideas.push("🥗 AI-powered nutrition and meal prep service");
      ideas.push("💪 Fitness app with real-time form correction");
      ideas.push("😴 Sleep optimization platform with tracking");
    }
    else if (keywordLower.includes('education') || keywordLower.includes('learn')) {
      ideas.push("📚 Micro-learning platform for professionals");
      ideas.push("🎮 Gamified coding education for kids");
      ideas.push("📝 AI essay grader and feedback tool");
      ideas.push("🌍 Language learning through cultural immersion");
    }
    else {
      ideas.push(`🚀 ${keyword} marketplace connecting experts and clients`);
      ideas.push(`💼 ${keyword} SaaS platform for small businesses`);
      ideas.push(`📈 ${keyword} analytics and insights dashboard`);
      ideas.push(`🎯 ${keyword} community platform with premium content`);
    }
    
    return ideas.slice(0, 4).map((idea, i) => `${i+1}. ${idea}`).join('\n');
  };

  // Handle tool execution with loading simulation
  const handleRunTool = (tool, input, setOutput, setLoading, generator) => {
    if (!input.trim()) {
      setOutput(generator(input));
      return;
    }
    
    setLoading(true);
    setOutput('⏳ Processing your request...');
    
    setTimeout(() => {
      const result = generator(input);
      setOutput(result);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="dashboard">
      {/* TOP NAVBAR */}
      <header className="dashboard-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="logo-wrapper">
              <span className="logo-icon">✨</span>
              <span className="logo-text">AI Productivity Suite</span>
            </div>
          </div>
          <div className="navbar-right">
            <div className="user-profile">
              <span className="user-icon">👤</span>
              <span className="user-name">User</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">AI Tools Dashboard</h1>
            <p className="dashboard-subtitle">Powerful AI tools at your fingertips — just input and run</p>
          </div>

          {/* Tools Grid - 2x2 */}
          <div className="tools-grid">
            
            {/* Tool 1: Resume Analyzer */}
            <div className="tool-card">
              <div className="tool-card-header">
                <div className="tool-icon">📄</div>
                <div>
                  <h3 className="tool-name">Resume Analyzer</h3>
                  <p className="tool-description">Get AI-powered feedback on your resume</p>
                </div>
              </div>
              
              <div className="workflow-indicator">
                <span className="workflow-step">Input</span>
                <span className="workflow-arrow">→</span>
                <span className="workflow-step">Process</span>
                <span className="workflow-arrow">→</span>
                <span className="workflow-step">Output</span>
              </div>
              
              <div className="tool-input-area">
                <textarea
                  className="tool-input"
                  placeholder="Paste your resume content or skills here..."
                  value={resumeInput}
                  onChange={(e) => setResumeInput(e.target.value)}
                  rows="3"
                />
              </div>
              
              <button 
                className="run-button"
                onClick={() => handleRunTool('resume', resumeInput, setResumeOutput, setResumeLoading, analyzeResume)}
                disabled={resumeLoading}
              >
                {resumeLoading ? '⏳ Analyzing...' : '🚀 Run Analysis'}
              </button>
              
              <div className="tool-output">
                <div className="output-label">AI Feedback:</div>
                <div className="output-content">
                  {resumeOutput ? (
                    resumeOutput.split('\n').map((line, i) => (
                      <div key={i} className="output-line">{line}</div>
                    ))
                  ) : (
                    <span className="output-placeholder">✨ Analysis results will appear here</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tool 2: Interview Simulator */}
            <div className="tool-card">
              <div className="tool-card-header">
                <div className="tool-icon">🎤</div>
                <div>
                  <h3 className="tool-name">Interview Simulator</h3>
                  <p className="tool-description">Practice with AI-generated questions</p>
                </div>
              </div>
              
              <div className="workflow-indicator">
                <span className="workflow-step">Input</span>
                <span className="workflow-arrow">→</span>
                <span className="workflow-step">Process</span>
                <span className="workflow-arrow">→</span>
                <span className="workflow-step">Output</span>
              </div>
              
              <div className="tool-input-area">
                <input
                  type="text"
                  className="tool-input"
                  placeholder="Enter job role (e.g., Frontend Developer, Product Manager)"
                  value={interviewInput}
                  onChange={(e) => setInterviewInput(e.target.value)}
                />
              </div>
              
              <button 
                className="run-button"
                onClick={() => handleRunTool('interview', interviewInput, setInterviewOutput, setInterviewLoading, generateInterviewQuestions)}
                disabled={interviewLoading}
              >
                {interviewLoading ? '⏳ Generating...' : '🎙️ Generate Questions'}
              </button>
              
              <div className="tool-output">
                <div className="output-label">Interview Questions:</div>
                <div className="output-content">
                  {interviewOutput ? (
                    interviewOutput.split('\n').map((line, i) => (
                      <div key={i} className="output-line">{line}</div>
                    ))
                  ) : (
                    <span className="output-placeholder">📋 Practice questions will appear here</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tool 3: Debate AI */}
            <div className="tool-card">
              <div className="tool-card-header">
                <div className="tool-icon">💬</div>
                <div>
                  <h3 className="tool-name">Debate AI</h3>
                  <p className="tool-description">Get balanced arguments on any topic</p>
                </div>
              </div>
              
              <div className="workflow-indicator">
                <span className="workflow-step">Input</span>
                <span className="workflow-arrow">→</span>
                <span className="workflow-step">Process</span>
                <span className="workflow-arrow">→</span>
                <span className="workflow-step">Output</span>
              </div>
              
              <div className="tool-input-area">
                <input
                  type="text"
                  className="tool-input"
                  placeholder="Enter debate topic (e.g., AI Ethics, Remote Work)"
                  value={debateInput}
                  onChange={(e) => setDebateInput(e.target.value)}
                />
              </div>
              
              <button 
                className="run-button"
                onClick={() => handleRunTool('debate', debateInput, setDebateOutput, setDebateLoading, generateDebateArguments)}
                disabled={debateLoading}
              >
                {debateLoading ? '⏳ Analyzing...' : '⚖️ Generate Arguments'}
              </button>
              
              <div className="tool-output">
                <div className="output-label">Arguments:</div>
                <div className="output-content">
                  {debateOutput ? (
                    debateOutput.split('\n').map((line, i) => (
                      <div key={i} className="output-line">{line}</div>
                    ))
                  ) : (
                    <span className="output-placeholder">🧠 Pro & con arguments will appear here</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tool 4: Business Idea Generator */}
            <div className="tool-card">
              <div className="tool-card-header">
                <div className="tool-icon">🚀</div>
                <div>
                  <h3 className="tool-name">Business Idea Generator</h3>
                  <p className="tool-description">Spark creative business concepts</p>
                </div>
              </div>
              
              <div className="workflow-indicator">
                <span className="workflow-step">Input</span>
                <span className="workflow-arrow">→</span>
                <span className="workflow-step">Process</span>
                <span className="workflow-arrow">→</span>
                <span className="workflow-step">Output</span>
              </div>
              
              <div className="tool-input-area">
                <input
                  type="text"
                  className="tool-input"
                  placeholder="Enter keyword (e.g., sustainable, AI, education)"
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                />
              </div>
              
              <button 
                className="run-button"
                onClick={() => handleRunTool('idea', ideaInput, setIdeaOutput, setIdeaLoading, generateBusinessIdeas)}
                disabled={ideaLoading}
              >
                {ideaLoading ? '⏳ Generating...' : '✨ Generate Ideas'}
              </button>
              
              <div className="tool-output">
                <div className="output-label">Business Ideas:</div>
                <div className="output-content">
                  {ideaOutput ? (
                    ideaOutput.split('\n').map((line, i) => (
                      <div key={i} className="output-line">{line}</div>
                    ))
                  ) : (
                    <span className="output-placeholder">💡 Creative ideas will appear here</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <div className="footer-container">
          <p>© 2025 AI Productivity Suite · Empowering innovation with AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
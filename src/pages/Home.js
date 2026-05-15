// src/pages/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  //const navigate = useNavigate();

  // State for each tool's input and output
  const [resumeInput, setResumeInput] = useState('');
  const [resumeOutput, setResumeOutput] = useState('✨ AI suggestions will appear here');
  const [interviewInput, setInterviewInput] = useState('');
  const [interviewOutput, setInterviewOutput] = useState('📋 Practice questions appear here');
  const [debateInput, setDebateInput] = useState('');
  const [debateOutput, setDebateOutput] = useState('🧠 Pro & con arguments will be shown');
  const [ideaInput, setIdeaInput] = useState('');
  const [ideaOutput, setIdeaOutput] = useState('💡 Unique business ideas will appear');

  // Simulated AI Functions
  const analyzeResume = (text) => {
    if (!text.trim()) return "⚠️ Please paste some resume content or skills to analyze.";
    const lower = text.toLowerCase();
    let suggestions = [];
    if (lower.includes("marketing") || lower.includes("seo") || lower.includes("content")) {
      suggestions.push("✅ Highlight measurable results: e.g., 'Increased organic traffic by 120%'");
      suggestions.push("💡 Add specific tools: Google Analytics, SEMrush, or Ahrefs to boost ATS score.");
    }
    if (lower.includes("manager") || lower.includes("lead")) {
      suggestions.push("📌 Mention team size & leadership achievements → 'Led 5 cross-functional teams'");
    }
    if (lower.includes("python") || lower.includes("javascript") || lower.includes("react")) {
      suggestions.push("⚡ Include GitHub repo links or project impact metrics.");
    }
    if (suggestions.length === 0) {
      suggestions.push("✨ Use action verbs (Developed, Optimized, Launched) and quantify results.");
      suggestions.push("📊 Add a 'Key Achievements' section to stand out.");
    }
    suggestions.push("🎯 Customize your summary to match job description keywords.");
    return suggestions.slice(0, 4).join("\n");
  };

  const generateInterviewQuestions = (role) => {
    if (!role.trim()) return "🎤 Please specify a role (e.g., Data Scientist, UX Designer).";
    const roleClean = role.trim().toLowerCase();
    if (roleClean.includes("frontend") || roleClean.includes("react") || roleClean.includes("web")) {
      return "1. How do you optimize React component rendering?\n2. Explain the virtual DOM vs real DOM.\n3. Describe a challenging UI bug you solved.\n4. How do you ensure accessibility in components?";
    } else if (roleClean.includes("product") || roleClean.includes("pm")) {
      return "1. How do you prioritize features with limited resources?\n2. Tell me about a product you launched from idea to execution.\n3. How do you handle stakeholder disagreement?\n4. Define a KPI that matters most for your product.";
    } else if (roleClean.includes("data") || roleClean.includes("analyst")) {
      return "1. How would you handle missing data in a dataset?\n2. Explain a time you used SQL to solve a business problem.\n3. What metrics would you track for a SaaS dashboard?\n4. Walk me through an A/B test design.";
    } else {
      return `💼 Interview questions for ${role}:\n• What excites you about ${role}?\n• Describe a complex problem you solved recently.\n• How do you stay updated in your field?\n• Give an example of teamwork under tight deadlines.`;
    }
  };

  const generateDebateArguments = (topic) => {
    if (!topic.trim()) return "⚖️ Enter a debate topic (e.g., Universal Basic Income, AI regulation).";
    const topicText = topic.trim();
    let pro = [], con = [];
    if (topicText.toLowerCase().includes("ai") || topicText.toLowerCase().includes("artificial")) {
      pro = ["🚀 AI boosts productivity & automates repetitive work.", "📈 Enhances medical diagnostics and scientific discovery."];
      con = ["⚠️ Risk of job displacement & ethical bias.", "🔒 Privacy concerns and lack of transparency."];
    } else if (topicText.toLowerCase().includes("remote")) {
      pro = ["🏠 Flexibility & work-life balance improvement.", "🌍 Access global talent without geographical limits."];
      con = ["😐 Reduced spontaneous collaboration & company culture.", "📉 Potential burnout due to blurred boundaries."];
    } else if (topicText.toLowerCase().includes("climate")) {
      pro = ["🌱 Renewable energy investments reduce carbon footprint.", "🌊 Innovation in carbon capture tech."];
      con = ["⏳ High upfront costs & political inertia.", "📉 Requires global coordination which is complex."];
    } else {
      pro = [`✅ ${topicText} encourages innovation and progress.`, `💡 Could create new opportunities and economic growth.`];
      con = [`❌ Potential ethical dilemmas and unintended consequences.`, `⚡ May face resistance from traditional systems.`];
    }
    return `🔵 PRO arguments:\n${pro.join("\n")}\n\n🔴 CON arguments:\n${con.join("\n")}`;
  };

  const generateBusinessIdeas = (keyword) => {
    if (!keyword.trim()) return "💡 Type a keyword (e.g., 'eco-friendly packaging', 'AI tutoring') to spark ideas.";
    const kw = keyword.trim().toLowerCase();
    let ideas = [];
    if (kw.includes("ai") || kw.includes("machine learning")) {
      ideas.push("🤖 AI-powered resume screening for small businesses.");
      ideas.push("📊 Personalized learning assistant for students using generative AI.");
      ideas.push("🛠️ AI code review tool that suggests optimizations in real time.");
    } else if (kw.includes("sustainable") || kw.includes("eco")) {
      ideas.push("🌿 Zero-waste subscription box for home essentials.");
      ideas.push("♻️ Marketplace for upcycled furniture and decor.");
      ideas.push("📱 App that tracks carbon footprint of daily purchases.");
    } else if (kw.includes("health") || kw.includes("wellness")) {
      ideas.push("🧘 Virtual wellness coach with AI-guided meditation plans.");
      ideas.push("🥗 Meal prep service using locally sourced organic ingredients.");
    } else {
      ideas.push(`🚀 "${keyword}"-centric SaaS platform for freelancers.`);
      ideas.push(`📈 ${keyword} marketplace connecting experts and learners.`);
      ideas.push(`💼 ${keyword} consulting with AI-driven insights for startups.`);
    }
    return ideas.slice(0, 3).map((idea, i) => `${i+1}. ${idea}`).join("\n");
  };

  const handleRunTool = (tool, input, setOutput, generator) => {
    setOutput(`⏳ Processing...`);
    setTimeout(() => {
      const result = generator(input);
      setOutput(result);
    }, 300);
  };

  const scrollToTools = () => {
    const toolsSection = document.getElementById('toolsSection');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">AI Tools That Work For You</h1>
          <p className="hero-subtitle">Experience smart automation with real-time AI solutions</p>
          <button className="btn-primary" onClick={scrollToTools}>
            Try Tools →
          </button>
        </div>
      </section>

      {/* TOOLS SHOWCASE SECTION */}
      <section id="toolsSection" className="tools-section">
        <div className="container">
          <h2 className="section-title">Powerful AI, One Click Away</h2>
          
          <div className="tools-grid">
            {/* Tool 1: Resume Analyzer */}
            <div className="tool-card">
              <div className="tool-header">
                <span className="tool-icon">📄</span>
                <h3 className="tool-name">Resume Analyzer</h3>
              </div>
              <p className="tool-description">Upload resume text & get instant AI suggestions</p>
              <div className="tool-input-group">
                <label className="input-label">📝 Paste resume / job description snippet</label>
                <textarea
                  className="tool-input"
                  value={resumeInput}
                  onChange={(e) => setResumeInput(e.target.value)}
                  placeholder="e.g., Marketing manager with 5 years experience, SEO, content strategy..."
                  rows="3"
                />
              </div>
              <button
                className="run-btn"
                onClick={() => handleRunTool('resume', resumeInput, setResumeOutput, analyzeResume)}
              >
                ⚡ Run Analysis
              </button>
              <div className="output-preview">
                {resumeOutput.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>

            {/* Tool 2: Interview Simulator */}
            <div className="tool-card">
              <div className="tool-header">
                <span className="tool-icon">🎤</span>
                <h3 className="tool-name">Interview Simulator</h3>
              </div>
              <p className="tool-description">Enter role & get realistic interview questions</p>
              <div className="tool-input-group">
                <label className="input-label">💼 Target role / domain</label>
                <input
                  type="text"
                  className="tool-input"
                  value={interviewInput}
                  onChange={(e) => setInterviewInput(e.target.value)}
                  placeholder="e.g., Frontend Developer, Product Manager"
                />
              </div>
              <button
                className="run-btn"
                onClick={() => handleRunTool('interview', interviewInput, setInterviewOutput, generateInterviewQuestions)}
              >
                🎙️ Generate Questions
              </button>
              <div className="output-preview">
                {interviewOutput.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>

            {/* Tool 3: Debate AI */}
            <div className="tool-card">
              <div className="tool-header">
                <span className="tool-icon">💬</span>
                <h3 className="tool-name">Debate Arena</h3>
              </div>
              <p className="tool-description">Enter any topic → AI constructs strong arguments</p>
              <div className="tool-input-group">
                <label className="input-label">🔥 Debate topic</label>
                <input
                  type="text"
                  className="tool-input"
                  value={debateInput}
                  onChange={(e) => setDebateInput(e.target.value)}
                  placeholder="e.g., Remote work vs Office, AI ethics"
                />
              </div>
              <button
                className="run-btn"
                onClick={() => handleRunTool('debate', debateInput, setDebateOutput, generateDebateArguments)}
              >
                ⚖️ Generate Arguments
              </button>
              <div className="output-preview">
                {debateOutput.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>

            {/* Tool 4: Business Idea Generator */}
            <div className="tool-card">
              <div className="tool-header">
                <span className="tool-icon">🚀</span>
                <h3 className="tool-name">Business Idea Generator</h3>
              </div>
              <p className="tool-description">Enter a keyword → AI sparks creative business concepts</p>
              <div className="tool-input-group">
                <label className="input-label">🔑 Keyword / industry</label>
                <input
                  type="text"
                  className="tool-input"
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  placeholder="e.g., sustainable fashion, edtech, AI assistants"
                />
              </div>
              <button
                className="run-btn"
                onClick={() => handleRunTool('idea', ideaInput, setIdeaOutput, generateBusinessIdeas)}
              >
                ✨ Generate Ideas
              </button>
              <div className="output-preview">
                {ideaOutput.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          </div>

          {/* WORKFLOW VISUALIZATION */}
          <div className="workflow-row">
            <div className="workflow-step">
              <span className="step-icon">📝</span>
              <span>Your Input</span>
            </div>
            <span className="arrow-symbol">→</span>
            <div className="workflow-step">
              <span className="step-icon">⚙️</span>
              <span>AI Processing</span>
            </div>
            <span className="arrow-symbol">→</span>
            <div className="workflow-step">
              <span className="step-icon">✨</span>
              <span>Smart Output</span>
            </div>
          </div>
          <p className="workflow-note">Real-time simulation — each tool demonstrates prompt-based AI reasoning</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 AI CRAFT SUITE — Intelligent tools for modern work. All interactions simulated with AI logic.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
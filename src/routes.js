// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

// Resume Analyzer
import ResumeAnalyzer from './pages/ResumeAnalyzer/ResumeAnalyzer';
import ResumeResult from './pages/ResumeAnalyzer/ResumeResult';

// Debate Arena
import DebateArena from './pages/DebateArena/DebateArena';
import DebateChat from './pages/DebateArena/DebateChat';

// Interview Simulator
import InterviewSimulator from './pages/InterviewSimulator/InterviewSimulator';
import InterviewChat from './pages/InterviewSimulator/InterviewChat';

// Marketing Generator
import MarketingGenerator from './pages/MarketingGenerator/MarketingGenerator';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Page - New */}
      <Route path="/" element={<Home />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Resume Analyzer Routes */}
      <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
      <Route path="/resume-analyzer/result" element={<ResumeResult />} />
      
      {/* Debate Arena Routes */}
      <Route path="/debate-arena" element={<DebateArena />} />
      <Route path="/debate-arena/chat" element={<DebateChat />} />
      
      {/* Interview Simulator Routes */}
      <Route path="/interview-simulator" element={<InterviewSimulator />} />
      <Route path="/interview-simulator/chat" element={<InterviewChat />} />
      
      {/* Marketing Generator */}
      <Route path="/marketing-generator" element={<MarketingGenerator />} />
      
      {/* 404 Fallback - Redirect to Home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
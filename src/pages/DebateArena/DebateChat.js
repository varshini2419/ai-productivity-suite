// src/pages/DebateArena/DebateChat.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/DebateArena.css';
import logo from '../../assets/logoai3.png';
import { generateDebateResponse } from '../../services/aiService';

const DebateChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, position } = location.state || {};
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debateRound, setDebateRound] = useState(0);
  const [stats, setStats] = useState({
    userArguments: 0,
    aiResponses: 0,
    debateTime: 0
  });
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const timerRef = useRef(null);

  // Determine AI's fixed position (opposite of user)
  const aiPosition = position === 'for' ? 'against' : 'for';
  const aiPositionName = aiPosition === 'for' ? 'FOR' : 'AGAINST';

  useEffect(() => {
    if (!topic || !position) {
      navigate('/debate-arena');
      return;
    }

    // Start debate timer
    timerRef.current = setInterval(() => {
      setStats(prev => ({ ...prev, debateTime: prev.debateTime + 1 }));
    }, 1000);

    const initializeDebate = async () => {
      setLoading(true);
      try {
        // AI gives opening statement from its fixed position
        const initialResponse = await generateDebateResponse({
          topic,
          userMessage: `Start the debate on topic: "${topic}". I am arguing ${position} this position. You are the AI opponent arguing ${aiPosition} this position. Please give your opening statement.`,
          position: aiPosition, // AI always uses its fixed position
          history: [],
        });

        if (!initialResponse.success) {
          throw new Error(initialResponse.error);
        }

        setMessages([
          {
            id: 1,
            text: `🎯 Debate Started`,
            sender: 'system',
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            text: `Topic: "${topic}"`,
            sender: 'system',
            timestamp: new Date().toISOString()
          },
          {
            id: 3,
            text: `Your Position: ${position === 'for' ? 'FOR' : 'AGAINST'} | AI Position: ${aiPositionName}`,
            sender: 'system',
            timestamp: new Date().toISOString()
          },
          {
            id: 4,
            text: initialResponse.data.response,
            sender: 'ai',
            timestamp: new Date().toISOString()
          }
        ]);
        setDebateRound(1);
        setStats(prev => ({ ...prev, aiResponses: prev.aiResponses + 1 }));
      } catch (err) {
        setError('Failed to start debate. Please try again.');
        console.error('Debate initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeDebate();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [topic, position, navigate, aiPosition, aiPositionName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError('');

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setStats(prev => ({ ...prev, userArguments: prev.userArguments + 1 }));
    setLoading(true);

    try {
      // AI responds from its fixed position
      const aiResponse = await generateDebateResponse({
        topic,
        userMessage,
        position: aiPosition, // AI always uses its fixed position
        history: messages.map(msg => ({
          sender: msg.sender === 'user' ? 'user' : 'ai',
          text: msg.text
        })),
      });

      if (!aiResponse.success) {
        throw new Error(aiResponse.error);
      }

      // Add AI response
      const aiMsg = {
        id: messages.length + 2,
        text: aiResponse.data.response,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
      setStats(prev => ({ ...prev, aiResponses: prev.aiResponses + 1 }));
      
      setDebateRound(prev => prev + 1);
    } catch (err) {
      setError('Failed to get AI response. Please try again.');
      console.error('Debate response error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    navigate('/debate-arena');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSenderName = (sender) => {
    switch(sender) {
      case 'user': return 'You';
      case 'ai': return `AI Opponent (${aiPositionName})`;
      case 'system': return 'System';
      default: return 'AI';
    }
  };

  const getMessageClass = (sender) => {
    switch(sender) {
      case 'user': return 'user-message';
      case 'ai': return 'ai-message';
      case 'system': return 'system-message';
      default: return 'ai-message';
    }
  };

  if (!topic || !position) {
    return null;
  }

  return (
    <div className="debate-chat-arena">
      {/* Neural Background */}
      <div className="neural-bg"></div>

      {/* Main Container */}
      <div className="debate-chat-container">
        {/* Header */}
        <div className="chat-header glass-card">
          <div className="header-left">
            <img src={logo} alt="Logo" className="header-logo" />
            <div className="header-info">
              <h2 className="debate-topic">{topic}</h2>
              <div className="debate-meta">
                <span className={`position-indicator user-${position}`}>
                  You: {position === 'for' ? 'FOR' : 'AGAINST'}
                </span>
                <span className={`position-indicator ai-${aiPosition}`}>
                  AI: {aiPositionName}
                </span>
                <span className="round-indicator">Round {debateRound}</span>
              </div>
            </div>
          </div>
          <button onClick={clearChat} className="new-debate-btn">
            <span className="btn-icon">↻</span>
            New Debate
          </button>
        </div>

        {/* Main Chat Area with Side Panel */}
        <div className="chat-main-area">
          {/* Stats Side Panel */}
          <div className="stats-panel glass-card">
            <h3 className="stats-title">Debate Stats</h3>
            <div className="stats-content">
              <div className="stat-item">
                <span className="stat-icon">🔄</span>
                <span className="stat-label">Rounds</span>
                <span className="stat-value">{debateRound}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👤</span>
                <span className="stat-label">Your Arguments</span>
                <span className="stat-value">{stats.userArguments}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🤖</span>
                <span className="stat-label">AI Responses</span>
                <span className="stat-value">{stats.aiResponses}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⏱️</span>
                <span className="stat-label">Time</span>
                <span className="stat-value">{formatTime(stats.debateTime)}</span>
              </div>
              <div className="stat-item highlight">
                <span className="stat-icon">⚔️</span>
                <span className="stat-label">AI Position</span>
                <span className={`stat-value ${aiPosition}`}>{aiPositionName}</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages-wrapper" ref={chatContainerRef}>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${getMessageClass(message.sender)}`}
                >
                  <div className="message-avatar">
                    {message.sender === 'user' ? '👤' : 
                     message.sender === 'ai' ? '🤖' : '⚡'}
                  </div>
                  <div className="message-content-wrapper">
                    <div className="message-header">
                      <span className="message-sender">
                        {getSenderName(message.sender)}
                      </span>
                      <span className="message-timestamp">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="message-content">
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {loading && (
                <div className="message ai-thinking">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content-wrapper">
                    <div className="message-header">
                      <span className="message-sender">AI is thinking...</span>
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="chat-error glow-error">{error}</div>}

        {/* Input Area */}
        <div className="chat-input-area glass-card">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your argument here... (Press Enter to send)"
            className="chat-input futuristic-input"
            disabled={loading}
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || loading}
            className="send-message-btn"
          >
            <span className="btn-icon">📤</span>
            <span className="btn-text">Send</span>
            <span className="btn-glow"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebateChat;
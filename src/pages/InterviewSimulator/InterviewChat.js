// src/pages/InterviewSimulator/InterviewChat.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/InterviewSimulator.css'; // Updated import
//import Loader from '../../components/Loader';
import PromptViewer from '../../components/PromptViewer';
import { 
  generateInterviewQuestion, 
  evaluateInterviewAnswer 
} from '../../services/aiService';

const InterviewChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobRole, interviewType } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [userResponse, setUserResponse] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [answerAnalyses, setAnswerAnalyses] = useState([]);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!jobRole || !interviewType) {
      navigate('/interview-simulator');
      return;
    }

    const startInterview = async () => {
      setLoading(true);
      try {
        const response = await generateInterviewQuestion({
          jobRole,
          interviewType,
          questionNumber: 1,
          previousAnswers: []
        });

        const questionText = response.success && response.data 
          ? response.data.question || response.data 
          : response.question || response;

        setMessages([
          {
            id: 1,
            type: 'ai',
            content: questionText,
            timestamp: new Date().toISOString()
          }
        ]);

        setQuestionCount(1);
      } catch (err) {
        setError('Failed to start interview. Please try again.');
        console.error('Start interview error:', err);
      } finally {
        setLoading(false);
      }
    };

    startInterview();
  }, [jobRole, interviewType, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, answerAnalyses]);

  const analyzeAnswer = (question, answer) => {
    const analysis = {
      isCorrect: checkAnswerCorrectness(question, answer),
      feedback: generateFeedback(question, answer),
      correctAnswer: getCorrectAnswer(question),
      strengths: identifyStrengths(answer),
      improvements: suggestImprovements(question, answer),
      score: calculateScore(answer),
      keyPoints: getKeyPoints(question)
    };

    setAnswerAnalyses(prev => [...prev, {
      questionIndex: questionCount,
      question,
      answer,
      analysis,
      timestamp: new Date().toISOString()
    }]);
  };

  const checkAnswerCorrectness = (question, answer) => {
    const answerLower = answer.toLowerCase();
    
    if (question.toLowerCase().includes('flexbox') || question.toLowerCase().includes('grid')) {
      const hasResponsiveKeywords = answerLower.includes('media') || 
                                   answerLower.includes('responsive') ||
                                   answerLower.includes('mobile') ||
                                   answerLower.includes('wrap') ||
                                   answerLower.includes('auto-fit');
      
      const hasModernApproach = !answerLower.includes('fixed width') &&
                               !answerLower.includes('pixel width') &&
                               !answerLower.includes('avoid media query');
      
      return hasResponsiveKeywords && hasModernApproach;
    }
    
    return answer.length > 20;
  };

  const generateFeedback = (question, answer) => {
    const answerLower = answer.toLowerCase();
    
    if (question.toLowerCase().includes('flexbox')) {
      if (answerLower.includes('media query') && answerLower.includes('flex-wrap')) {
        return "Excellent answer! You understand responsive design principles well.";
      } else if (answerLower.includes('fixed width') || answerLower.includes('avoid media')) {
        return "Your answer needs improvement. Remember that responsive design requires flexible units and media queries, not fixed widths.";
      } else {
        return "Good attempt! Consider including more specific responsive techniques in your answer.";
      }
    }
    
    return "Answer received. Keep practicing to improve your responses!";
  };

  const getCorrectAnswer = (question) => {
    if (question.toLowerCase().includes('flexbox') || question.toLowerCase().includes('grid')) {
      return "To implement a responsive layout, I would use a mobile-first approach with CSS Grid or Flexbox. For Grid, I'd use 'repeat(auto-fit, minmax(250px, 1fr))' for auto-responsive columns. For Flexbox, I'd combine 'flex-wrap: wrap' with 'flex: 1 1 300px' and add media queries at strategic breakpoints to adjust layouts. I always use relative units (%, rem, vw) instead of fixed pixels and test across multiple devices.";
    }
    return "Consider researching best practices and industry standards for this topic.";
  };

  const identifyStrengths = (answer) => {
    const strengths = [];
    const answerLower = answer.toLowerCase();
    
    if (answerLower.includes('example') || answerLower.includes('scenario')) {
      strengths.push("Provided practical, real-world examples");
    }
    if (answer.length > 100) {
      strengths.push("Gave a comprehensive, detailed explanation");
    }
    if (answerLower.includes('because') || answerLower.includes('reason')) {
      strengths.push("Demonstrated logical reasoning behind choices");
    }
    if (answerLower.includes('best practice') || answerLower.includes('industry standard')) {
      strengths.push("Showed awareness of industry best practices");
    }
    
    return strengths.length ? strengths : ["Made a solid attempt at answering"];
  };

  const suggestImprovements = (question, answer) => {
    const improvements = [];
    const answerLower = answer.toLowerCase();
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('flexbox') || questionLower.includes('grid')) {
      if (!answerLower.includes('media query')) {
        improvements.push("Include media queries to handle different screen sizes");
      }
      if (answerLower.includes('fixed width') || answerLower.includes('pixel')) {
        improvements.push("Use relative units (%, rem, vw, fr) instead of fixed pixels for better responsiveness");
      }
      if (!answerLower.includes('mobile')) {
        improvements.push("Adopt a mobile-first approach for better performance on all devices");
      }
      if (!answerLower.includes('wrap') && !answerLower.includes('auto-fit')) {
        improvements.push("Use flex-wrap or auto-fit to create automatically responsive layouts");
      }
    }
    
    if (answer.length < 50) {
      improvements.push("Provide a more detailed explanation with specific examples");
    }
    if (!answerLower.includes('example')) {
      improvements.push("Include concrete examples to illustrate your points");
    }
    
    return improvements.length ? improvements : ["Add specific code examples", "Explain the reasoning behind your choices", "Mention real-world applications"];
  };

  const calculateScore = (answer) => {
    let score = 5;
    
    if (answer.length > 200) score += 2;
    else if (answer.length > 100) score += 1;
    
    if (answer.includes('example')) score += 1;
    if (answer.includes('because')) score += 1;
    if (answer.includes('media query')) score += 1;
    if (!answer.includes('fixed width')) score += 1;
    if (answer.includes('best practice')) score += 1;
    if (answer.includes('responsive')) score += 1;
    
    return Math.min(10, score);
  };

  const getKeyPoints = (question) => {
    if (question.toLowerCase().includes('flexbox') || question.toLowerCase().includes('grid')) {
      return [
        "Start with a mobile-first approach",
        "Implement media queries at strategic breakpoints",
        "Use relative units (%, rem, fr, vw) for flexibility",
        "Leverage flex-wrap or auto-fit for automatic responsiveness",
        "Test your layout on multiple devices and screen sizes",
        "Consider accessibility and performance"
      ];
    }
    return ["Provide specific examples from your experience", "Explain your thought process clearly", "Show practical application of concepts", "Reference industry best practices"];
  };

  const handleSendResponse = async () => {
    if (!userResponse.trim() || loading || interviewEnded) return;

    const response = userResponse.trim();
    setUserResponse('');
    setLoading(true);
    setError('');

    const currentQuestion = messages
      .filter(m => m.type === 'ai')
      .pop()?.content || '';

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: response,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    analyzeAnswer(currentQuestion, response);

    try {
      if (questionCount >= 5) {
        const allAnswers = [
          ...messages.filter(m => m.type === 'user').map(m => m.content),
          response
        ];

        const allQuestions = messages
          .filter(m => m.type === 'ai')
          .map(m => m.content);

        const interviewFeedback = await evaluateInterviewAnswer({
          jobRole,
          interviewType,
          questions: allQuestions,
          answers: allAnswers
        });

        if (interviewFeedback.success && interviewFeedback.data) {
          setFeedback(interviewFeedback.data);
        } else {
          setFeedback(interviewFeedback);
        }
        
        setInterviewEnded(true);

      } else {
        const previousAnswers = [
          ...messages.filter(m => m.type === 'user').map(m => m.content),
          response
        ];

        const nextQuestionResponse = await generateInterviewQuestion({
          jobRole,
          interviewType,
          questionNumber: questionCount + 1,
          previousAnswers
        });

        const nextQuestion = nextQuestionResponse.success && nextQuestionResponse.data
          ? nextQuestionResponse.data.question || nextQuestionResponse.data
          : nextQuestionResponse.question || nextQuestionResponse;

        const aiMessage = {
          id: messages.length + 2,
          type: 'ai',
          content: nextQuestion,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, aiMessage]);
        setQuestionCount(prev => prev + 1);
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Send response error:', err);
    } finally {
      setLoading(false);
    }
  };

  const restartInterview = () => {
    navigate('/interview-simulator');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendResponse();
    }
  };

  if (!jobRole || !interviewType) return null;

  // Get score class for styling
  const getScoreClass = (score) => {
    if (score >= 8) return 'score-high';
    if (score >= 6) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="interview-chat-container">
      {/* Neural Background */}
      <div className="neural-bg"></div>

      {/* Chat Header */}
      <div className="interview-chat-header glass-card">
        <div className="header-info">
          <h2>{jobRole}</h2>
          <div className="interview-meta">
            <span className={`interview-type-badge ${interviewType}`}>
              {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview
            </span>
            <span className="job-role-badge">
              <span className="label-icon">🎯</span>
              {jobRole}
            </span>
            <div className="question-progress">
              <span>Question {questionCount} of 5</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(questionCount / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <button onClick={restartInterview} className="new-interview-btn">
          <span className="btn-icon">↻</span>
          New Interview
        </button>
      </div>

      {/* Chat Messages */}
      <div className="interview-chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`interview-message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-sender">
              {message.type === 'user' ? 'You' : 'AI Interviewer'}
            </div>
            <div className="message-bubble">
              <p>{message.content}</p>
            </div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="interview-message ai-message">
            <div className="message-sender">AI Interviewer</div>
            <div className="message-bubble">
              <div className="typing-indicator-modern">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="interview-error">{error}</div>}

        {/* Answer Analyses */}
        {answerAnalyses.length > 0 && !interviewEnded && (
          <div className="answer-analyses-container">
            {answerAnalyses.map((item, index) => (
              <div key={index} className="analysis-card">
                <div className="analysis-header">
                  <h4>Question {item.questionIndex} Analysis</h4>
                  <div className={`score-badge ${getScoreClass(item.analysis.score)}`}>
                    Score: {item.analysis.score}/10
                  </div>
                </div>
                
                <div className={`correctness-indicator ${item.analysis.isCorrect ? 'correct' : 'incorrect'}`}>
                  <span className="indicator-icon">
                    {item.analysis.isCorrect ? '✅' : '❌'}
                  </span>
                  <span>
                    {item.analysis.isCorrect ? 'Good Answer' : 'Needs Improvement'}
                  </span>
                </div>

                <div className="analysis-section">
                  <div className="analysis-section-title">
                    <span>📝</span> Feedback
                  </div>
                  <div className="analysis-section-content">
                    {item.analysis.feedback}
                  </div>
                </div>

                {!item.analysis.isCorrect && item.analysis.correctAnswer && (
                  <div className="analysis-section">
                    <div className="analysis-section-title">
                      <span>✓</span> Better Answer
                    </div>
                    <div className="analysis-section-content">
                      {item.analysis.correctAnswer}
                    </div>
                  </div>
                )}

                {item.analysis.keyPoints && item.analysis.keyPoints.length > 0 && (
                  <div className="analysis-section">
                    <div className="analysis-section-title">
                      <span>🔑</span> Key Points to Include
                    </div>
                    <ul className="analysis-list key-points-list">
                      {item.analysis.keyPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.analysis.strengths && item.analysis.strengths.length > 0 && (
                  <div className="analysis-section">
                    <div className="analysis-section-title">
                      <span>💪</span> Strengths
                    </div>
                    <ul className="analysis-list strengths-list">
                      {item.analysis.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.analysis.improvements && item.analysis.improvements.length > 0 && (
                  <div className="analysis-section">
                    <div className="analysis-section-title">
                      <span>📈</span> Suggestions for Improvement
                    </div>
                    <ul className="analysis-list improvements-list">
                      {item.analysis.improvements.map((improvement, idx) => (
                        <li key={idx}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Final Feedback */}
        {interviewEnded && feedback && (
          <div className="feedback-container">
            <h3>Interview Complete</h3>
            
            {feedback.score && (
              <div className="feedback-score">
                <span>{feedback.score}/10</span>
                <span>Overall Score</span>
              </div>
            )}

            {feedback.feedback && (
              <div className="feedback-text">
                <p>{feedback.feedback}</p>
              </div>
            )}

            {feedback.strengths && feedback.strengths.length > 0 && (
              <div className="analysis-section">
                <div className="analysis-section-title" style={{ color: '#10b981' }}>
                  <span>✓</span> Key Strengths
                </div>
                <ul className="analysis-list strengths-list">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements && feedback.improvements.length > 0 && (
              <div className="analysis-section">
                <div className="analysis-section-title" style={{ color: '#f59e0b' }}>
                  <span>📝</span> Areas to Improve
                </div>
                <ul className="analysis-list improvements-list">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            {answerAnalyses.length > 0 && (
              <div className="analysis-section">
                <div className="analysis-section-title">
                  <span>📊</span> Answer Breakdown
                </div>
                {answerAnalyses.map((item, index) => (
                  <div key={index} className="analysis-card" style={{ marginBottom: '1rem' }}>
                    <h5 style={{ color: 'var(--interview-primary)', marginBottom: '0.5rem' }}>
                      Question {index + 1}
                    </h5>
                    <p style={{ color: '#a0aec0', marginBottom: '0.5rem' }}>
                      <strong>Your Answer:</strong> {item.answer}
                    </p>
                    <p style={{ color: '#a0aec0' }}>
                      <strong>Score:</strong> {item.analysis.score}/10
                    </p>
                  </div>
                ))}
              </div>
            )}

            <PromptViewer
              prompt="Complete Interview Analysis"
              response={JSON.stringify({
                overall: feedback,
                detailedAnalyses: answerAnalyses.map(a => ({
                  question: a.question,
                  answer: a.answer,
                  analysis: a.analysis
                }))
              }, null, 2)}
            />

            <button onClick={restartInterview} className="restart-button">
              Practice Another Interview
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!interviewEnded && (
        <div className="interview-chat-input">
          <textarea
            ref={inputRef}
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
            disabled={loading}
            rows="3"
            className="interview-textarea"
          />
          <button 
            onClick={handleSendResponse} 
            disabled={loading || !userResponse.trim()}
            className="send-response-btn"
          >
            <span className="btn-icon">📤</span>
            <span className="btn-text">Send</span>
            <span className="btn-glow"></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewChat;
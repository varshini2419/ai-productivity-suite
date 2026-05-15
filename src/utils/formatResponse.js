/**
 * Format Resume Analysis Response
 * @param {string} responseText - Raw AI response
 * @returns {Object} - Structured resume analysis
 */
export const formatResumeAnalysis = (responseText) => {
  try {
    // Try to parse if response is JSON
    if (typeof responseText === 'string') {
      try {
        const parsed = JSON.parse(responseText);
        return {
          score: parsed.score || 0,
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
          skills: Array.isArray(parsed.recommendedSkills) ? parsed.recommendedSkills : []
        };
      } catch {
        // If not JSON, extract from text
        return extractResumeFromText(responseText);
      }
    }
    
    // If already an object
    return {
      score: responseText.score || 0,
      strengths: responseText.strengths || [],
      weaknesses: responseText.weaknesses || [],
      improvements: responseText.improvements || [],
      skills: responseText.recommendedSkills || []
    };
  } catch (error) {
    console.error('Error formatting resume analysis:', error);
    return getDefaultResumeFormat();
  }
};

/**
 * Extract resume data from text response
 * @param {string} text 
 * @returns {Object}
 */
const extractResumeFromText = (text) => {
  const defaultFormat = getDefaultResumeFormat();
  
  // Try to extract score
  const scoreMatch = text.match(/(\d{1,3})\s*\/\s*100/i) || text.match(/score[:\s]*(\d{1,3})/i);
  if (scoreMatch) {
    defaultFormat.score = parseInt(scoreMatch[1]) || 0;
  }
  
  // Extract lists (simple extraction)
  const lines = text.split('\n');
  let currentSection = '';
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('strength')) {
      currentSection = 'strengths';
    } else if (lowerLine.includes('weakness')) {
      currentSection = 'weaknesses';
    } else if (lowerLine.includes('improvement')) {
      currentSection = 'improvements';
    } else if (lowerLine.includes('skill') || lowerLine.includes('learn')) {
      currentSection = 'skills';
    } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      const item = line.replace(/^[-•]\s*/, '').trim();
      if (item && defaultFormat[currentSection]) {
        defaultFormat[currentSection].push(item);
      }
    }
  });
  
  return defaultFormat;
};

/**
 * Get default resume format
 * @returns {Object}
 */
const getDefaultResumeFormat = () => ({
  score: 75,
  strengths: ['Strong work experience', 'Relevant education', 'Good technical skills'],
  weaknesses: ['Missing quantifiable achievements', 'Format could be improved'],
  improvements: ['Add more action verbs', 'Include metrics in experience'],
  skills: ['Communication', 'Problem Solving', 'Team Leadership']
});

/**
 * Format Debate Response
 * @param {string} responseText 
 * @returns {string}
 */
export const formatDebateResponse = (responseText) => {
  if (!responseText) return '';
  
  // Clean up debate response
  return responseText
    .replace(/\s+/g, ' ') // Replace multiple spaces
    .replace(/^(AI:|Assistant:|Debater:)\s*/i, '') // Remove prefixes
    .trim();
};

/**
 * Format Interview Feedback
 * @param {string|Object} responseText 
 * @returns {Object}
 */
export const formatInterviewFeedback = (responseText) => {
  try {
    // Try to parse JSON
    if (typeof responseText === 'string') {
      try {
        const parsed = JSON.parse(responseText);
        return {
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
          rating: parsed.score || parsed.rating || 75,
          feedback: parsed.feedback || parsed.overall || ''
        };
      } catch {
        // Extract from text
        return extractInterviewFromText(responseText);
      }
    }
    
    // If already object
    return {
      strengths: responseText.strengths || [],
      improvements: responseText.improvements || [],
      rating: responseText.score || responseText.rating || 75,
      feedback: responseText.feedback || responseText.overall || ''
    };
  } catch (error) {
    console.error('Error formatting interview feedback:', error);
    return getDefaultInterviewFormat();
  }
};

/**
 * Extract interview feedback from text
 * @param {string} text 
 * @returns {Object}
 */
const extractInterviewFromText = (text) => {
  const defaultFormat = getDefaultInterviewFormat();
  
  const lines = text.split('\n');
  let currentSection = '';
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('strength')) {
      currentSection = 'strengths';
    } else if (lowerLine.includes('improvement')) {
      currentSection = 'improvements';
    } else if (lowerLine.includes('rating') || lowerLine.includes('score')) {
      const match = line.match(/(\d{1,3})/);
      if (match) defaultFormat.rating = parseInt(match[1]);
    } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      const item = line.replace(/^[-•]\s*/, '').trim();
      if (item && defaultFormat[currentSection]) {
        defaultFormat[currentSection].push(item);
      }
    }
  });
  
  return defaultFormat;
};

/**
 * Get default interview format
 * @returns {Object}
 */
const getDefaultInterviewFormat = () => ({
  strengths: ['Good communication', 'Relevant examples provided'],
  improvements: ['More specific details needed', 'Structure answers better'],
  rating: 75,
  feedback: 'Overall good performance with room for improvement.'
});

/**
 * Format Marketing Content
 * @param {string} responseText 
 * @returns {string}
 */
export const formatMarketingContent = (responseText) => {
  if (!responseText) return '';
  
  // Clean up marketing copy
  return responseText
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/^(Copy:|Content:|Marketing Copy:)\s*/i, '') // Remove prefixes
    .trim();
};

/**
 * Format Website Content
 * @param {string|Object} responseText 
 * @returns {Object}
 */
export const formatWebsiteContent = (responseText) => {
  try {
    // Try to parse JSON
    if (typeof responseText === 'string') {
      try {
        const parsed = JSON.parse(responseText);
        return {
          hero: parsed.hero || parsed.title || '',
          about: parsed.about || parsed.description || '',
          services: parsed.services || parsed.menu || parsed.projects || [],
          contact: parsed.contact || parsed.contactInfo || ''
        };
      } catch {
        // Return as text if not JSON
        return {
          hero: '',
          about: responseText,
          services: [],
          contact: ''
        };
      }
    }
    
    // If already object
    return {
      hero: responseText.hero || responseText.title || '',
      about: responseText.about || responseText.description || '',
      services: responseText.services || responseText.menu || responseText.projects || [],
      contact: responseText.contact || responseText.contactInfo || ''
    };
  } catch (error) {
    console.error('Error formatting website content:', error);
    return getDefaultWebsiteFormat();
  }
};

/**
 * Get default website format
 * @returns {Object}
 */
const getDefaultWebsiteFormat = () => ({
  hero: 'Welcome to Our Website',
  about: 'We provide excellent services to our customers.',
  services: ['Service 1', 'Service 2', 'Service 3'],
  contact: 'contact@example.com'
});

/**
 * Generic response cleaner
 * @param {string} text 
 * @returns {string}
 */
export const cleanResponse = (text) => {
  if (!text) return '';
  
  return text
    .replace(/```json\n?|```\n?/g, '') // Remove code blocks
    .replace(/\\n/g, '\n') // Replace escaped newlines
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
    .trim();
};

/**
 * Extract JSON from text response
 * @param {string} text 
 * @returns {Object|null}
 */
export const extractJSON = (text) => {
  try {
    // Try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch {
    return null;
  }
};
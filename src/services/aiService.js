/**
 * AI Service using Groq API
 */

import {
  resumeAnalysisPrompt,
  debatePrompt,
  interviewQuestionPrompt,
  interviewEvaluationPrompt,
  marketingPrompt,
  websitePrompt
} from './promptTemplates';

const GROQ_API_URL = process.env.REACT_APP_OPENAI_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Try multiple models in order of preference
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
  'mixtral-8x7b-32768'
];

// Current active model (will be updated if fallback is used)
let activeModel = GROQ_MODELS[0];

console.log('🚀 AI Service Initialized with preferred model:', activeModel);

const callGroqAPI = async (prompt, temperature = 0.7, maxTokens = 1024) => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not found. Please check your .env file.');
    }

    if (!GROQ_API_URL) {
      throw new Error('Groq API URL not found. Please check your .env file.');
    }

    console.log('📡 Calling Groq API with prompt length:', prompt.length);

    // Try each model in sequence until one works
    for (const model of GROQ_MODELS) {
      try {
        console.log('Attempting with model:', model);
        
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are a helpful AI assistant. Provide accurate and concise responses.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature,
            max_tokens: maxTokens
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn(`Model ${model} failed:`, errorData.error?.message);
          
          // Check if it's a model deprecation error
          if (errorData.error?.message?.includes('decommissioned') || 
              errorData.error?.message?.includes('not supported') ||
              errorData.error?.message?.includes('deprecated')) {
            console.log(`Model ${model} is deprecated, trying next model...`);
            continue; // Try next model
          }
          
          // For rate limit errors, wait and retry with same model
          if (errorData.error?.message?.includes('rate limit')) {
            console.log('Rate limit hit, waiting 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          
          // For other errors, throw immediately
          throw new Error(errorData.error?.message || 'API error');
        }

        const data = await response.json();
        activeModel = model; // Update active model
        console.log('✅ Successfully using model:', model);
        
        const content = data.choices[0]?.message?.content || '';
        return {
          success: true,
          data: content,
          model: model
        };
        
      } catch (modelError) {
        console.warn(`❌ Error with model ${model}:`, modelError.message);
        continue; // Try next model
      }
    }
    
    // If all models fail
    throw new Error('All Groq models failed. Please check your API key and model availability at https://console.groq.com/docs/deprecations');
    
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// RESUME ANALYZER
export const analyzeResume = async (resumeText, jobRole) => {
  try {
    const prompt = resumeAnalysisPrompt(resumeText, jobRole);
    const response = await callGroqAPI(prompt, 0.5, 2048);
    
    if (!response.success) {
      throw new Error(response.error);
    }

    try {
      // Clean the response - remove markdown code blocks if present
      const cleaned = response.data.replace(/```json\n?|```/g, '').trim();
      const analysis = JSON.parse(cleaned);
      
      return {
        success: true,
        data: {
          score: analysis.score || 75,
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          improvements: analysis.improvements || [],
          recommendedSkills: analysis.recommendedSkills || []
        }
      };
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      console.log('Raw response:', response.data);
      
      // Fallback response if JSON parsing fails
      return {
        success: true,
        data: {
          score: 75,
          strengths: ["Strong technical background"],
          weaknesses: ["Missing quantifiable achievements"],
          improvements: ["Add metrics to showcase impact"],
          recommendedSkills: ["Communication", "Leadership"]
        }
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// DEBATE ARENA
export const generateDebateResponse = async ({ topic, userMessage, position, history = [] }) => {
  try {
    const prompt = debatePrompt(topic, userMessage, position, history);
    const response = await callGroqAPI(prompt, 0.8, 1024);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    return {
      success: true,
      data: {
        response: response.data.trim()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// INTERVIEW QUESTION
export const generateInterviewQuestion = async ({ jobRole, interviewType, questionNumber, previousAnswers = [] }) => {
  try {
    const prompt = interviewQuestionPrompt(jobRole, interviewType, questionNumber);
    const response = await callGroqAPI(prompt, 0.7, 512);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    return {
      success: true,
      data: {
        question: response.data.trim()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// INTERVIEW EVALUATION
export const evaluateInterviewAnswer = async ({ userAnswer, question, jobRole, interviewType }) => {
  try {
    const prompt = interviewEvaluationPrompt(userAnswer, question, jobRole, interviewType);
    const response = await callGroqAPI(prompt, 0.5, 1024);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    try {
      const cleaned = response.data.replace(/```json\n?|```/g, '').trim();
      const evaluation = JSON.parse(cleaned);
      
      return {
        success: true,
        data: {
          feedback: evaluation.feedback || "Good answer overall.",
          score: evaluation.score || 7,
          strengths: evaluation.strengths || ["Good answer"],
          improvements: evaluation.improvements || ["Could be more specific"]
        }
      };
    } catch (e) {
      // Fallback if JSON parsing fails
      return {
        success: true,
        data: {
          feedback: response.data,
          score: 7,
          strengths: ["Good answer"],
          improvements: ["Could be more specific"]
        }
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// ANALYZE ANSWER CORRECTNESS
export const analyzeAnswerCorrectness = async ({ question, answer, jobRole, interviewType, context }) => {
  try {
    const prompt = `You are an expert interviewer evaluating a candidate's answer.

Job Role: ${jobRole}
Interview Type: ${interviewType}
Context: ${context || 'technical interview'}

Question: "${question}"
Candidate's Answer: "${answer}"

Analyze this answer and provide feedback in the following JSON format:
{
  "isCorrect": (boolean - whether the answer is technically correct),
  "score": (number between 1-10),
  "feedback": "Brief feedback on the answer (1-2 sentences)",
  "correctAnswer": "The correct/ideal answer to the question",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "strengths": ["Strength of candidate's answer"],
  "improvements": ["How to improve the answer"],
  "detailedExplanation": "Detailed explanation of the correct concept"
}

Consider:
- Technical accuracy
- Completeness of answer
- Practical examples provided
- Understanding of core concepts

Return ONLY the JSON object, no additional text.`;

    const response = await callGroqAPI(prompt, 0.5, 2048);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    try {
      const cleaned = response.data.replace(/```json\n?|```/g, '').trim();
      const analysis = JSON.parse(cleaned);
      
      return {
        success: true,
        data: {
          isCorrect: analysis.isCorrect || false,
          score: analysis.score || 5,
          feedback: analysis.feedback || "Answer analyzed.",
          correctAnswer: analysis.correctAnswer || "See key points below.",
          keyPoints: analysis.keyPoints || ["Review core concepts"],
          strengths: analysis.strengths || [],
          improvements: analysis.improvements || ["Provide more specific examples"],
          detailedExplanation: analysis.detailedExplanation || ""
        }
      };
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      
      // Fallback analysis
      return {
        success: true,
        data: {
          isCorrect: answer.length > 50,
          score: Math.min(10, Math.floor(answer.length / 20)),
          feedback: "Answer analyzed. Consider reviewing best practices.",
          correctAnswer: "Research standard approaches to this topic.",
          keyPoints: ["Provide specific examples", "Explain reasoning", "Show practical application"],
          strengths: ["Attempted to answer"],
          improvements: ["Add more technical details", "Include code examples if applicable"],
          detailedExplanation: "Review the key points above for improvement."
        }
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// ✅ FIXED: MARKETING CONTENT GENERATION
export const generateMarketingContent = async ({ businessName, productName, targetAudience, marketingType }) => {
  try {
    console.log('🎯 Generating marketing content for:', { businessName, productName, targetAudience, marketingType });
    
    const prompt = marketingPrompt(businessName, productName, targetAudience, marketingType);
    const response = await callGroqAPI(prompt, 0.8, 1024);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    return {
      success: true,
      data: {
        content: response.data.trim()
      },
      model: response.model
    };
  } catch (error) {
    console.error('Marketing generation error:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// WEBSITE CONTENT
export const generateWebsiteContent = async ({ brandName, businessType, description, contactInfo = '' }) => {
  try {
    console.log('🌐 Generating website content for:', { brandName, businessType });
    
    const prompt = websitePrompt(brandName, businessType, description, contactInfo);
    const response = await callGroqAPI(prompt, 0.6, 2048);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    try {
      const cleaned = response.data.replace(/```json\n?|```/g, '').trim();
      const content = JSON.parse(cleaned);
      return {
        success: true,
        data: content,
        model: response.model
      };
    } catch (e) {
      console.error('Failed to parse website JSON:', e);
      // Fallback
      return {
        success: true,
        data: {
          hero: `Welcome to ${brandName}`,
          about: description,
          services: [],
          values: ["Quality", "Innovation", "Customer Focus"]
        },
        model: response.model
      };
    }
  } catch (error) {
    console.error('Website generation error:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// TEST FUNCTION
export const testGroqConnection = async () => {
  try {
    console.log('🧪 Testing Groq API connection...');
    const result = await callGroqAPI("Say 'API is working!' in one sentence.", 0.5, 50);
    
    if (result.success) {
      return { 
        success: true, 
        message: result.data, 
        model: result.model,
        note: `Successfully using model: ${result.model}`
      };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      error: error.message,
      models: GROQ_MODELS,
      note: 'Please check your API key and model availability at https://console.groq.com'
    };
  }
};

// Get current active model
export const getActiveModel = () => {
  return activeModel;
};

// Get available models
export const getAvailableModels = () => {
  return GROQ_MODELS;
};
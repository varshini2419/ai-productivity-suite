// 1️⃣ Resume Analyzer Prompt
export const resumeAnalysisPrompt = (resumeText, jobRole) => {
  return `You are an expert career coach and resume reviewer. Analyze this resume for a ${jobRole} position.

Resume Content:
${resumeText}

Provide your analysis in the following JSON format:
{
  "score": (number between 0-100),
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "recommendedSkills": ["skill1", "skill2", ...]
}

Return ONLY the JSON object, no additional text.`;
};

// 2️⃣ Debate Arena Prompt
export const debatePrompt = (topic, userMessage, position, history) => {
  const conversationHistory = history && history.length > 0 
    ? `\nPrevious conversation:\n${history.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}`
    : '';

  return `You are an expert debater participating in a formal debate.

Topic: ${topic}
Your position: ${position === 'for' ? 'FOR' : 'AGAINST'} this topic
${conversationHistory}

User's latest argument: "${userMessage}"

Generate a persuasive counter-argument that:
1. Acknowledges the user's point respectfully
2. Presents logical reasoning and evidence
3. Stays focused on the topic
4. Maintains a professional tone

Keep your response concise (2-4 sentences) but impactful.`;
};

// 3️⃣ Interview Question Prompt
export const interviewQuestionPrompt = (jobRole, interviewType, questionNumber) => {
  return `You are an experienced hiring manager conducting a ${interviewType} interview for a ${jobRole} position.

Generate question #${questionNumber} that:
- Is appropriate for a ${interviewType} interview
- Tests relevant skills for a ${jobRole}
- Is clear and professional
- Encourages detailed responses

Return only the question, no explanations or additional text.`;
};

// 4️⃣ Interview Evaluation Prompt
export const interviewEvaluationPrompt = (userAnswer, question, jobRole, interviewType) => {
  return `You are an interview coach evaluating a candidate's response.

Interview Type: ${interviewType}
Job Role: ${jobRole}
Question: "${question}"
Candidate's Answer: "${userAnswer}"

Evaluate this answer and provide feedback in the following JSON format:
{
  "feedback": "Overall feedback on the answer (2-3 sentences)",
  "score": (number between 1-10),
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...]
}

Consider:
- Relevance to the question
- Clarity and structure
- Specific examples provided
- Professional tone

Return ONLY the JSON object, no additional text.`;
};

// 5️⃣ Marketing Content Prompt
export const marketingPrompt = (businessName, productName, targetAudience, marketingType) => {
  const typeGuides = {
    instagram: "Create an engaging Instagram caption with emojis and relevant hashtags. Include a call-to-action.",
    facebook: "Write a professional Facebook ad copy that drives conversions. Include headline, main text, and CTA.",
    product: "Write a compelling product description that highlights features and benefits.",
    email: "Create an email marketing copy with subject line, preview text, and engaging body content."
  };

  return `You are a professional marketing copywriter. Generate ${marketingType} marketing content for:

Business: ${businessName}
Product/Service: ${productName}
Target Audience: ${targetAudience}

Requirements:
${typeGuides[marketingType] || typeGuides.product}

Make the content:
- Engaging and persuasive
- Tailored to the target audience
- Highlight unique selling points
- Include a clear call-to-action

Return only the generated content, no explanations.`;
};

// 6️⃣ Website Content Prompt
export const websitePrompt = (brandName, businessType, description, contactInfo) => {
  const structureGuides = {
    restaurant: `{
      "hero": "Welcome to [Restaurant Name] - [Tagline]",
      "about": "About section text based on: ${description}",
      "menu": [
        {"name": "Dish Name", "description": "Description", "price": "$XX"},
        {"name": "Dish Name", "description": "Description", "price": "$XX"}
      ],
      "hours": "Operating hours suggestion"
    }`,
    business: `{
      "hero": "[Company Name] - [Value Proposition]",
      "about": "Company description based on: ${description}",
      "services": [
        {"name": "Service Name", "description": "Service description"},
        {"name": "Service Name", "description": "Service description"}
      ],
      "values": ["Value1", "Value2", "Value3"]
    }`,
    portfolio: `{
      "hero": "Hi, I'm [Name] - [Title/Tagline]",
      "about": "About me section based on: ${description}",
      "skills": ["Skill1", "Skill2", "Skill3"],
      "projects": [
        {"name": "Project Name", "description": "Description", "tech": ["Tech1", "Tech2"]}
      ]
    }`
  };

  return `You are a web designer creating content for a ${businessType} website.

Brand: ${brandName}
Business Type: ${businessType}
Description: ${description}
Contact: ${contactInfo}

Generate website content in the following JSON structure:
${structureGuides[businessType] || structureGuides.business}

Return ONLY the JSON object, no additional text.`;
};
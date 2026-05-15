// src/utils/simplePdfParser.js
// Simple PDF parser that doesn't rely on pdfjs-dist worker

/**
 * Extracts text from a PDF file using a simple approach
 * For demo purposes, returns sample text based on filename
 * In production, you'd use a server-side API or proper PDF parser
 * 
 * @param {File} file - The PDF file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPDFSimple = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      // Validate file
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      if (file.type !== 'application/pdf') {
        reject(new Error('File must be a PDF'));
        return;
      }

      console.log('Simple PDF parser processing:', file.name);

      // For demo purposes, generate sample resume text based on filename
      const fileName = file.name.toLowerCase();
      
      let sampleText = '';
      
      if (fileName.includes('developer') || fileName.includes('engineer')) {
        sampleText = `SAMPLE RESUME - SOFTWARE DEVELOPER

JOHN DOE
Email: john.doe@email.com | Phone: (555) 123-4567

SUMMARY
Experienced software developer with 5+ years of expertise in full-stack development. Passionate about creating efficient, scalable applications.

WORK EXPERIENCE

Senior Developer | Tech Solutions Inc. | 2021 - Present
- Led development of React-based dashboard used by 500+ clients
- Improved application performance by 40% through code optimization
- Mentored junior developers and conducted code reviews

Software Developer | Digital Innovations | 2019 - 2021
- Developed RESTful APIs using Node.js and Express
- Collaborated with UX team to implement responsive designs
- Participated in agile development cycles

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015 - 2019

SKILLS
JavaScript, React, Node.js, Python, SQL, Git, AWS`;
      } 
      else if (fileName.includes('product') || fileName.includes('manager')) {
        sampleText = `SAMPLE RESUME - PRODUCT MANAGER

JANE SMITH
Email: jane.smith@email.com | Phone: (555) 987-6543

SUMMARY
Results-driven Product Manager with 6 years of experience in SaaS products. Skilled in market research, product strategy, and cross-functional leadership.

WORK EXPERIENCE

Senior Product Manager | CloudTech | 2020 - Present
- Launched 3 successful products generating $2M in annual revenue
- Conducted 50+ customer interviews to inform product roadmap
- Collaborated with engineering and design teams on feature prioritization

Product Manager | StartupHub | 2018 - 2020
- Managed product lifecycle for B2B software platform
- Increased user engagement by 35% through feature improvements
- Created product requirements and user stories

EDUCATION
MBA in Product Management
Business School | 2016 - 2018

SKILLS
Product Strategy, Market Research, Agile, Scrum, Data Analysis, UX Design`;
      }
      else {
        sampleText = `SAMPLE RESUME - GENERAL

ALEX JOHNSON
Email: alex.j@email.com | Phone: (555) 555-5555

SUMMARY
Dedicated professional with 4 years of experience seeking a challenging role in ${fileName.replace('.pdf', '').replace(/-/g, ' ')}.

WORK EXPERIENCE

Professional Role | Company Name | 2020 - Present
- Accomplished key project objectives
- Collaborated with team members on various initiatives
- Received recognition for outstanding performance

Previous Role | Previous Company | 2018 - 2020
- Developed skills in communication and problem-solving
- Contributed to team success through dedicated effort

EDUCATION
Bachelor's Degree
University Name | 2014 - 2018

SKILLS
Communication, Teamwork, Problem Solving, Adaptability, Microsoft Office`;
      }

      // Simulate processing time
      setTimeout(() => {
        resolve(sampleText);
      }, 1000);

    } catch (error) {
      reject(new Error(`Failed to process PDF: ${error.message}`));
    }
  });
};

/**
 * Alternative method that reads file metadata
 * @param {File} file 
 * @returns {Promise<Object>}
 */
export const getPDFMetadata = async (file) => {
  return new Promise((resolve) => {
    const metadata = {
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString()
    };
    
    resolve(metadata);
  });
};
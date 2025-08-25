const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initialize();
  }

  initialize() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found in environment variables');
      return;
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateSprintPlan(prdText, weeks = 4, userProfile = null) {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.');
    }

    const prompt = this.createSprintPlanPrompt(prdText, weeks, userProfile);

    try {
      console.log('🤖 Calling Gemini API...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response from Gemini API');
      }
      
      const text = response.text();
      console.log('📝 Gemini response received, length:', text.length);
      
      // Clean the response text to ensure it's valid JSON
      let cleanText = text.trim();
      
      // Remove any markdown code block formatting if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      // Parse the JSON response from Gemini
      const sprintPlan = JSON.parse(cleanText);
      console.log('✅ Successfully parsed Gemini response');
      return sprintPlan;
    } catch (error) {
      console.error('❌ Error generating sprint plan with Gemini:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText
      });
      throw new Error('Failed to generate sprint plan using AI');
    }
  }

  createSprintPlanPrompt(prdText, weeks, userProfile) {
    const profileContext = userProfile ? `
User Profile Context:
- Role: ${userProfile.role || 'Not specified'}
- Team Size: ${userProfile.team_size || 'Not specified'}
- Experience Level: ${userProfile.experience_level || 'Not specified'}
- Preferred Tools: ${userProfile.preferred_tools?.join(', ') || 'Not specified'}
- Primary Goal: ${userProfile.primary_goal || 'Not specified'}
` : '';

    return `You are an expert Agile project manager and sprint planner. Based on the following Product Requirements Document (PRD), create a detailed ${weeks}-week sprint plan.

${profileContext}

PRD Content:
${prdText}

Please generate a comprehensive sprint plan with the following structure (respond with valid JSON only):

{
  "epics": [
    {
      "title": "Epic Title",
      "description": "Detailed epic description",
      "priority": "high|medium|low",
      "estimatedWeeks": 2
    }
  ],
  "user_stories": [
    {
      "epic": "Epic Title",
      "story": "As a [user type], I want [goal] so that [benefit]",
      "acceptanceCriteria": ["Criteria 1", "Criteria 2"],
      "storyPoints": 5,
      "priority": "high|medium|low"
    }
  ],
  "timeline": [
    {
      "milestone": "Milestone Name",
      "week": 1,
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "deliverables": ["Deliverable 1", "Deliverable 2"],
      "riskFactors": ["Risk 1", "Risk 2"]
    }
  ],
  "totalWeeks": ${weeks},
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "techStack": ["Technology 1", "Technology 2"],
  "teamRoles": ["Role 1", "Role 2"]
}

Guidelines:
1. Create realistic epics that break down the PRD into manageable chunks
2. Write user stories in proper Agile format with acceptance criteria
3. Distribute work evenly across ${weeks} weeks
4. Include appropriate story points (1, 2, 3, 5, 8, 13)
5. Consider the user's experience level and team size in your recommendations
6. Include potential risks and mitigation strategies
7. Suggest appropriate technology stack based on requirements
8. Ensure timeline is realistic and achievable

Respond with valid JSON only, no additional text or formatting.`;
  }

  async generateWeeklyTasks(epicTitle, userStories, weekNumber, totalWeeks) {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.');
    }

    const prompt = `Generate detailed weekly tasks for Week ${weekNumber} of ${totalWeeks} for the epic "${epicTitle}".

User Stories for this epic:
${userStories.map(story => `- ${story.story}`).join('\n')}

Create a detailed breakdown of tasks for this week. Respond with valid JSON only:

{
  "weeklyTasks": [
    {
      "task": "Task description",
      "estimatedHours": 8,
      "assignedRole": "Developer|Designer|QA|PM",
      "dependencies": ["Task dependency"],
      "deliverable": "What will be completed"
    }
  ],
  "weekGoal": "Main objective for this week",
  "successCriteria": ["Criteria 1", "Criteria 2"]
}

Respond with valid JSON only.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Error generating weekly tasks:', error);
      throw new Error('Failed to generate weekly tasks');
    }
  }
}

module.exports = new GeminiService();

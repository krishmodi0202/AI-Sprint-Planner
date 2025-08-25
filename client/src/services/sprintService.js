import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class SprintService {
  async generateSprintPlan(prdText, weeks = 4, userProfile = null) {
    try {
      const response = await axios.post(`${API_BASE_URL}/plan`, {
        prdText,
        weeks,
        userProfile
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error generating sprint plan:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate sprint plan'
      };
    }
  }

  async generateWeeklyTasks(epicTitle, userStories, weekNumber, totalWeeks) {
    try {
      const response = await axios.post(`${API_BASE_URL}/weekly-tasks`, {
        epicTitle,
        userStories,
        weekNumber,
        totalWeeks
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error generating weekly tasks:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate weekly tasks'
      };
    }
  }

  async exportToTrello(sprintData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/export`, {
        data: sprintData
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error exporting to Trello:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to export to Trello'
      };
    }
  }
}

export default new SprintService();

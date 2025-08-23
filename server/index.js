const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock AI function to convert PRD to structured sprint plan
function generateSprintPlan(prdText) {
  // This is a mock implementation. In production, you'd call OpenAI API
  const mockResponse = {
    epics: [
      {
        title: "User Authentication System",
        description: "Implement secure user registration, login, and profile management"
      },
      {
        title: "Core Application Features",
        description: "Build the main functionality as described in the PRD"
      },
      {
        title: "Admin Dashboard",
        description: "Create administrative interface for system management"
      }
    ],
    user_stories: [
      {
        epic: "User Authentication System",
        story: "As a new user, I want to register an account so that I can access the application"
      },
      {
        epic: "User Authentication System",
        story: "As a registered user, I want to log in securely so that I can use my account"
      },
      {
        epic: "Core Application Features",
        story: "As a user, I want to access the main features described in the PRD"
      },
      {
        epic: "Core Application Features",
        story: "As a user, I want a responsive interface that works on all devices"
      },
      {
        epic: "Admin Dashboard",
        story: "As an admin, I want to view system analytics and user management tools"
      }
    ],
    timeline: [
      {
        milestone: "Week 1",
        tasks: ["User registration system", "Login functionality"]
      },
      {
        milestone: "Week 2",
        tasks: ["Core feature implementation", "UI/UX design"]
      },
      {
        milestone: "Week 3",
        tasks: ["Admin dashboard", "Testing and bug fixes"]
      },
      {
        milestone: "Week 4",
        tasks: ["Final integration", "Deployment preparation"]
      }
    ]
  };

  return mockResponse;
}

// Routes
app.post('/api/plan', (req, res) => {
  try {
    const { prdText } = req.body;
    
    if (!prdText) {
      return res.status(400).json({ error: 'PRD text is required' });
    }

    const sprintPlan = generateSprintPlan(prdText);
    res.json(sprintPlan);
  } catch (error) {
    console.error('Error generating sprint plan:', error);
    res.status(500).json({ error: 'Failed to generate sprint plan' });
  }
});

app.post('/api/export', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Sprint plan data is required' });
    }

    // Stub function for Trello export
    exportToTrello(data);
    res.json({ message: 'Sprint plan exported to Trello successfully' });
  } catch (error) {
    console.error('Error exporting to Trello:', error);
    res.status(500).json({ error: 'Failed to export to Trello' });
  }
});

// Stub function for Trello integration
function exportToTrello(sprintData) {
  console.log('=== EXPORTING TO TRELLO ===');
  console.log('Sprint Plan Data:');
  console.log(JSON.stringify(sprintData, null, 2));
  console.log('=== END EXPORT ===');
  
  // In a real implementation, you would:
  // 1. Create a Trello board
  // 2. Create lists for each epic
  // 3. Create cards for each user story
  // 4. Add timeline information as due dates
}

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prdText, setPrdText] = useState('');
  const [sprintPlan, setSprintPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const generateSprintPlan = async () => {
    if (!prdText.trim()) {
      setError('Please enter a PRD text');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/plan', {
        prdText: prdText
      });
      setSprintPlan(response.data);
    } catch (err) {
      setError('Failed to generate sprint plan. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToTrello = async () => {
    if (!sprintPlan) {
      setError('No sprint plan to export');
      return;
    }

    setExporting(true);
    setError('');

    try {
      await axios.post('/api/export', {
        data: sprintPlan
      });
      alert('Sprint plan exported to Trello successfully! Check the server console for details.');
    } catch (err) {
      setError('Failed to export to Trello. Please try again.');
      console.error('Error:', err);
    } finally {
      setExporting(false);
    }
  };

  const samplePRD = `Product Requirement Document: Task Management App

Overview:
Build a modern task management application that helps teams organize, track, and collaborate on projects.

Core Features:
1. User Authentication - Secure login/registration system
2. Project Management - Create and manage multiple projects
3. Task Creation - Add tasks with descriptions, priorities, and due dates
4. Team Collaboration - Invite team members and assign tasks
5. Progress Tracking - Visual dashboards and progress indicators
6. Notifications - Real-time updates and email notifications

Technical Requirements:
- Responsive web application
- Real-time updates
- Mobile-friendly interface
- Data export capabilities
- Integration with popular tools

Success Metrics:
- User adoption rate > 80%
- Task completion rate improvement
- Reduced project delivery time`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Sprint Planner</h1>
            <div className="text-sm text-gray-500">
              Convert PRDs into structured sprint plans
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label htmlFor="prd-input" className="block text-sm font-medium text-gray-700 mb-2">
                Product Requirement Document
              </label>
              <textarea
                id="prd-input"
                value={prdText}
                onChange={(e) => setPrdText(e.target.value)}
                placeholder="Paste your PRD text here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={() => setPrdText(samplePRD)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Use sample PRD
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={generateSprintPlan}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Generating...' : 'Generate Sprint Plan'}
              </button>
              
              {sprintPlan && (
                <button
                  onClick={exportToTrello}
                  disabled={exporting}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {exporting ? 'Exporting...' : 'Export to Trello'}
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Sprint Plan Output</h2>
            
            {sprintPlan ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 space-y-6">
                  {/* Epics */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Epics</h3>
                    <div className="space-y-3">
                      {sprintPlan.epics.map((epic, index) => (
                        <div key={index} className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900">{epic.title}</h4>
                          <p className="text-sm text-blue-700 mt-1">{epic.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Stories */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">User Stories</h3>
                    <div className="space-y-2">
                      {sprintPlan.user_stories.map((story, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">{story.epic}</div>
                          <div className="text-sm text-gray-800">{story.story}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
                    <div className="space-y-3">
                      {sprintPlan.timeline.map((milestone, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900">{milestone.milestone}</h4>
                          <ul className="text-sm text-green-700 mt-2 space-y-1">
                            {milestone.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg">No sprint plan generated yet</p>
                  <p className="text-sm mt-1">Enter a PRD and click "Generate Sprint Plan" to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

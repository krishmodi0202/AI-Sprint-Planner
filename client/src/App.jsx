import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import AuthButton from './components/AuthButton';
import ProtectedRoute from './components/ProtectedRoute';
import { saveSprintPlan, getUserSprintPlans } from './lib/database';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isSignedIn, user, dbUser } = useAuth();
  const [prdText, setPrdText] = useState('');
  const [sprintPlan, setSprintPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [savedPlans, setSavedPlans] = useState([]);

  // Load saved plans when user is authenticated
  const loadSavedPlans = async () => {
    if (user) {
      try {
        const plans = await getUserSprintPlans(user.id);
        setSavedPlans(plans);
      } catch (error) {
        console.error('Error loading saved plans:', error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadSavedPlans();
    }
  }, [user]);

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
      
      // Save to database if user is authenticated
      if (user && response.data) {
        try {
          await saveSprintPlan(user.id, prdText, response.data);
          loadSavedPlans(); // Refresh saved plans
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
        }
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Sprint Planner
              </h1>
            </motion.div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Convert PRDs into structured sprint plans
              </div>
              <AuthButton />
            </div>
          </div>
        </div>
      </motion.header>

      <ProtectedRoute>
        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="prd-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Requirement Document
                </label>
                <motion.textarea
                  id="prd-input"
                  value={prdText}
                  onChange={(e) => setPrdText(e.target.value)}
                  placeholder="Paste your PRD text here..."
                  className="w-full h-96 p-4 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-lg hover:shadow-xl transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <motion.button
                  onClick={() => setPrdText(samplePRD)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✨ Use sample PRD
                </motion.button>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  onClick={generateSprintPlan}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Sprint Plan</span>
                    </div>
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {sprintPlan && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={exportToTrello}
                      disabled={exporting}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: exporting ? 1 : 1.02 }}
                      whileTap={{ scale: exporting ? 1 : 0.98 }}
                    >
                      {exporting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Exporting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          <span>Export to Trello</span>
                        </div>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Output Section */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900">Sprint Plan Output</h2>
              
              <AnimatePresence mode="wait">
                {sprintPlan ? (
                  <motion.div 
                    key="sprint-plan"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden shadow-2xl"
                  >
                    <div className="p-6 space-y-6">
                      {/* Epics */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Epics</h3>
                        <div className="space-y-3">
                          {sprintPlan.epics.map((epic, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow duration-300"
                            >
                              <h4 className="font-medium text-blue-900">{epic.title}</h4>
                              <p className="text-sm text-blue-700 mt-1">{epic.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* User Stories */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">User Stories</h3>
                        <div className="space-y-2">
                          {sprintPlan.user_stories.map((story, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300"
                            >
                              <div className="text-xs text-gray-500 mb-1 font-medium">{story.epic}</div>
                              <div className="text-sm text-gray-800">{story.story}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
                        <div className="space-y-3">
                          {sprintPlan.timeline.map((milestone, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 hover:shadow-lg transition-shadow duration-300"
                            >
                              <h4 className="font-medium text-green-900">{milestone.milestone}</h4>
                              <ul className="text-sm text-green-700 mt-2 space-y-1">
                                {milestone.tasks.map((task, taskIndex) => (
                                  <motion.li 
                                    key={taskIndex} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (index * 0.1) + (taskIndex * 0.05) }}
                                    className="flex items-center"
                                  >
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                    {task}
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/60 backdrop-blur-lg rounded-xl border border-white/20 p-8 text-center shadow-xl"
                  >
                    <div className="text-gray-400">
                      <motion.svg 
                        className="mx-auto h-12 w-12 mb-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </motion.svg>
                      <p className="text-lg font-medium">No sprint plan generated yet</p>
                      <p className="text-sm mt-1">Enter a PRD and click "Generate Sprint Plan" to get started</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.main>
      </ProtectedRoute>
    </div>
  );
}

export default App;

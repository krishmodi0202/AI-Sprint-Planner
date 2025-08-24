import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = ({ 
  currentStep, 
  prdText, 
  selectedWeeks, 
  sprintPlan, 
  isSignedIn 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  // Define guidance steps based on user progress
  const getGuidanceSteps = () => {
    const steps = [];

    if (!isSignedIn) {
      steps.push({
        id: 'signin',
        title: '👋 Welcome to AI Sprint Planner!',
        message: 'Hi there! I\'m your AI assistant. First, please sign in to save your sprint plans and access all features.',
        action: 'Click the "Sign In" button in the top right corner',
        priority: 'high'
      });
    }

    if (isSignedIn && !prdText.trim()) {
      steps.push({
        id: 'prd',
        title: '📝 Let\'s Start with Your PRD',
        message: 'Great! Now let\'s create your first sprint plan. Start by entering your Product Requirement Document in the text area.',
        action: 'Paste your PRD or click "✨ Use sample PRD" to try with example data',
        priority: 'high'
      });
    }

    if (prdText.trim() && !sprintPlan) {
      steps.push({
        id: 'weeks',
        title: '⏱️ Choose Your Sprint Duration',
        message: `Perfect! I can see you have a PRD ready. Now select how many weeks you want for your sprint. Currently set to ${selectedWeeks} weeks.`,
        action: 'Adjust the sprint duration if needed, then click "Generate Sprint Plan"',
        priority: 'high'
      });
    }

    if (sprintPlan) {
      steps.push({
        id: 'review',
        title: '🎉 Sprint Plan Generated!',
        message: 'Excellent! Your sprint plan is ready. Review the epics, user stories, and timeline. You can export this to Trello when ready.',
        action: 'Review your plan and click "Export to Trello" to create boards and cards',
        priority: 'medium'
      });
    }

    // Always show helpful tips
    steps.push({
      id: 'tips',
      title: '💡 Pro Tips',
      message: getTipMessage(),
      action: 'Click on different elements to explore more features',
      priority: 'low'
    });

    return steps;
  };

  const getTipMessage = () => {
    const tips = [
      'Try different sprint durations to see how tasks are distributed!',
      'Your sprint plans are automatically saved to your account.',
      'Use the sample PRD to quickly test the application.',
      'Each epic contains related user stories for better organization.',
      'Timeline shows week-by-week task distribution.',
      'Export to Trello creates organized boards for your team.',
      'Hover over elements to see interactive animations!'
    ];
    return tips[currentTip % tips.length];
  };

  // Cycle through tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentSteps = getGuidanceSteps();
  const primaryStep = currentSteps.find(step => step.priority === 'high') || currentSteps[0];

  // Text-to-speech function
  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.voice = speechSynthesis.getVoices().find(voice => 
        voice.name.includes('Female') || voice.name.includes('Samantha')
      ) || speechSynthesis.getVoices()[0];
      speechSynthesis.speak(utterance);
    }
  };

  if (!isVisible || !primaryStep) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Assistant Header */}
          <div className="bg-white/10 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <span className="text-white text-sm">🤖</span>
              </motion.div>
              <div>
                <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                <p className="text-white/70 text-xs">Here to help!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => speakMessage(primaryStep.message)}
                className="text-white/70 hover:text-white p-1 rounded"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Read aloud"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8 6H5a2 2 0 00-2 2v8a2 2 0 002 2h3l5 5V1L8 6z" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/70 hover:text-white p-1 rounded"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => setIsVisible(false)}
                className="text-white/70 hover:text-white p-1 rounded"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Assistant Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 text-white"
              >
                <motion.div
                  key={primaryStep.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h4 className="font-semibold text-sm mb-2">{primaryStep.title}</h4>
                  <p className="text-sm text-white/90 mb-3 leading-relaxed">
                    {primaryStep.message}
                  </p>
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <p className="text-xs text-white/80 font-medium mb-1">Next Step:</p>
                    <p className="text-xs text-white/90">{primaryStep.action}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="bg-white/10 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Progress</span>
              <span>{Math.min(currentSteps.length, 4)}/4 steps</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1 mt-1">
              <motion.div
                className="bg-white rounded-full h-1"
                initial={{ width: 0 }}
                animate={{ width: `${(Math.min(currentSteps.length, 4) / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;

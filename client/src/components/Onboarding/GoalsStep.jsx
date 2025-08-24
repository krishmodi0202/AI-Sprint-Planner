import React, { useState } from 'react';

const GoalsStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const goals = [
    {
      id: 'improve-productivity',
      title: 'Improve Team Productivity',
      description: 'Streamline workflows and reduce time spent on planning',
      icon: '⚡'
    },
    {
      id: 'better-planning',
      title: 'Better Sprint Planning',
      description: 'Create more accurate and detailed sprint plans',
      icon: '📋'
    },
    {
      id: 'team-collaboration',
      title: 'Enhance Team Collaboration',
      description: 'Improve communication and alignment across team members',
      icon: '🤝'
    },
    {
      id: 'project-visibility',
      title: 'Increase Project Visibility',
      description: 'Get better insights into project progress and bottlenecks',
      icon: '👁️'
    },
    {
      id: 'reduce-meetings',
      title: 'Reduce Planning Meetings',
      description: 'Minimize time spent in planning meetings with AI assistance',
      icon: '⏰'
    },
    {
      id: 'learn-agile',
      title: 'Learn Agile Best Practices',
      description: 'Understand and implement agile methodologies effectively',
      icon: '📚'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.primaryGoal) {
      newErrors.primaryGoal = 'Please select your primary goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  const handleGoalSelect = (goalId) => {
    updateFormData({ primaryGoal: goalId });
    if (errors.primaryGoal) {
      setErrors(prev => ({ ...prev, primaryGoal: '' }));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your primary goal?</h2>
        <p className="text-gray-600">Help us understand what you want to achieve with AI Sprint Planner.</p>
      </div>

      <div className="space-y-4">
        {goals.map(goal => (
          <div
            key={goal.id}
            onClick={() => handleGoalSelect(goal.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              formData.primaryGoal === goal.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-2xl">{goal.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
              <div className="flex-shrink-0">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.primaryGoal === goal.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {formData.primaryGoal === goal.id && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {errors.primaryGoal && (
          <p className="text-sm text-red-600">{errors.primaryGoal}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default GoalsStep;

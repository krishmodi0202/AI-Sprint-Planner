import React from 'react';

const CompletionStep = ({ formData, completeOnboarding, prevStep }) => {
  const getGoalTitle = (goalId) => {
    const goals = {
      'improve-productivity': 'Improve Team Productivity',
      'better-planning': 'Better Sprint Planning',
      'team-collaboration': 'Enhance Team Collaboration',
      'project-visibility': 'Increase Project Visibility',
      'reduce-meetings': 'Reduce Planning Meetings',
      'learn-agile': 'Learn Agile Best Practices'
    };
    return goals[goalId] || goalId;
  };

  return (
    <div className="p-8 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
        <p className="text-gray-600">Thanks for taking the time to set up your profile. Here's what we learned about you:</p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <p className="text-gray-900">{formData.fullName}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Role:</span>
            <p className="text-gray-900">{formData.role}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Team Size:</span>
            <p className="text-gray-900">{formData.teamSize}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Experience:</span>
            <p className="text-gray-900">{formData.experienceLevel}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Primary Goal:</span>
            <p className="text-gray-900">{getGoalTitle(formData.primaryGoal)}</p>
          </div>
          {formData.preferredTools && formData.preferredTools.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-500">Preferred Tools:</span>
              <p className="text-gray-900">{formData.preferredTools.slice(0, 3).join(', ')}{formData.preferredTools.length > 3 ? '...' : ''}</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What's next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 text-2xl mb-2">🚀</div>
            <h4 className="font-medium text-gray-900 mb-1">Start Planning</h4>
            <p className="text-gray-600">Create your first AI-powered sprint plan</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-600 text-2xl mb-2">🎯</div>
            <h4 className="font-medium text-gray-900 mb-1">Set Goals</h4>
            <p className="text-gray-600">Define your project objectives and milestones</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 text-2xl mb-2">📊</div>
            <h4 className="font-medium text-gray-900 mb-1">Track Progress</h4>
            <p className="text-gray-600">Monitor your team's progress and insights</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Back
        </button>
        <button
          onClick={completeOnboarding}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default CompletionStep;

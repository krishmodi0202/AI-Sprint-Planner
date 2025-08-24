import React, { useState } from 'react';

const PreferencesStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const tools = [
    'Jira', 'Trello', 'Asana', 'Monday.com', 'Notion', 'Linear',
    'Azure DevOps', 'GitHub Projects', 'ClickUp', 'Slack', 'Microsoft Teams', 'Other'
  ];

  const hearAboutOptions = [
    'Google Search', 'Social Media', 'Friend/Colleague', 'Blog/Article',
    'Conference/Event', 'Email Newsletter', 'Advertisement', 'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.preferredTools || formData.preferredTools.length === 0) {
      newErrors.preferredTools = 'Please select at least one tool';
    }
    
    if (!formData.hearAboutUs) {
      newErrors.hearAboutUs = 'Please tell us how you heard about us';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  const handleToolToggle = (tool) => {
    const currentTools = formData.preferredTools || [];
    const updatedTools = currentTools.includes(tool)
      ? currentTools.filter(t => t !== tool)
      : [...currentTools, tool];
    
    updateFormData({ preferredTools: updatedTools });
    
    if (errors.preferredTools && updatedTools.length > 0) {
      setErrors(prev => ({ ...prev, preferredTools: '' }));
    }
  };

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Preferences</h2>
        <p className="text-gray-600">Tell us about your tool preferences and how you found us.</p>
      </div>

      <div className="space-y-6">
        {/* Preferred Tools */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Which project management tools do you currently use? * <span className="text-gray-500">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tools.map(tool => (
              <label key={tool} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.preferredTools?.includes(tool) || false}
                  onChange={() => handleToolToggle(tool)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">{tool}</span>
              </label>
            ))}
          </div>
          {errors.preferredTools && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredTools}</p>
          )}
        </div>

        {/* How did you hear about us */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How did you hear about us? *
          </label>
          <select
            value={formData.hearAboutUs || ''}
            onChange={(e) => handleInputChange('hearAboutUs', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.hearAboutUs ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select an option</option>
            {hearAboutOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.hearAboutUs && (
            <p className="mt-1 text-sm text-red-600">{errors.hearAboutUs}</p>
          )}
        </div>

        {/* Email Updates */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.agreeToUpdates || false}
              onChange={(e) => handleInputChange('agreeToUpdates', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div className="ml-3">
              <span className="text-sm text-gray-700">
                I'd like to receive product updates and tips via email
              </span>
              <p className="text-xs text-gray-500 mt-1">
                You can unsubscribe at any time. We respect your privacy.
              </p>
            </div>
          </label>
        </div>
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

export default PreferencesStep;

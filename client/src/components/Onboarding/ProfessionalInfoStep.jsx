import React, { useState } from 'react';

const ProfessionalInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const roles = [
    'Product Manager', 'Software Engineer', 'Designer', 'Data Scientist',
    'Project Manager', 'Scrum Master', 'Business Analyst', 'QA Engineer',
    'DevOps Engineer', 'Marketing Manager', 'Founder/CEO', 'Other'
  ];

  const teamSizes = [
    'Just me (1)', 'Small team (2-5)', 'Medium team (6-15)', 
    'Large team (16-50)', 'Enterprise (50+)'
  ];

  const experienceLevels = [
    'Beginner (0-1 years)', 'Intermediate (2-5 years)', 
    'Advanced (6-10 years)', 'Expert (10+ years)'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    if (!formData.teamSize) {
      newErrors.teamSize = 'Please select your team size';
    }
    
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Please select your experience level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Background</h2>
        <p className="text-gray-600">Help us understand your work environment and experience.</p>
      </div>

      <div className="space-y-6">
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your role? *
          </label>
          <select
            value={formData.role || ''}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select your role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your team size? *
          </label>
          <div className="grid grid-cols-1 gap-3">
            {teamSizes.map(size => (
              <label key={size} className="flex items-center">
                <input
                  type="radio"
                  name="teamSize"
                  value={size}
                  checked={formData.teamSize === size}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-gray-700">{size}</span>
              </label>
            ))}
          </div>
          {errors.teamSize && (
            <p className="mt-1 text-sm text-red-600">{errors.teamSize}</p>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience with project management? *
          </label>
          <div className="grid grid-cols-1 gap-3">
            {experienceLevels.map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="experienceLevel"
                  value={level}
                  checked={formData.experienceLevel === level}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-gray-700">{level}</span>
              </label>
            ))}
          </div>
          {errors.experienceLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.experienceLevel}</p>
          )}
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

export default ProfessionalInfoStep;

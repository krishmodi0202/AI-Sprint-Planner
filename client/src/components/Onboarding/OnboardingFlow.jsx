import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import PersonalInfoStep from './PersonalInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import PreferencesStep from './PreferencesStep';
import GoalsStep from './GoalsStep';
import CompletionStep from './CompletionStep';

const OnboardingFlow = ({ onComplete }) => {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    ageGroup: '',
    country: '',
    
    // Professional Info
    role: '',
    teamSize: '',
    experienceLevel: '',
    
    // Preferences
    preferredTools: [],
    hearAboutUs: '',
    agreeToUpdates: false,
    
    // Goals
    primaryGoal: ''
  });

  const totalSteps = 5;

  const steps = [
    { id: 1, title: 'Personal Info', component: PersonalInfoStep },
    { id: 2, title: 'Professional', component: ProfessionalInfoStep },
    { id: 3, title: 'Preferences', component: PreferencesStep },
    { id: 4, title: 'Goals', component: GoalsStep },
    { id: 5, title: 'Complete', component: CompletionStep }
  ];

  const updateFormData = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Prepare data for Supabase
      const profileData = {
        clerk_user_id: user?.id,
        full_name: formData.fullName,
        email: user?.primaryEmailAddress?.emailAddress || formData.email,
        role: formData.role,
        team_size: formData.teamSize,
        experience_level: formData.experienceLevel,
        preferred_tools: formData.preferredTools,
        age_group: formData.ageGroup,
        country: formData.country,
        primary_goal: formData.primaryGoal,
        referral_source: formData.hearAboutUs,
        notifications_consent: formData.agreeToUpdates
      };

      // Save to Supabase
      const { createUserProfile } = await import('../../lib/profileService');
      const result = await createUserProfile(profileData);
      
      if (result.success) {
        // Save profile ID to localStorage for quick access
        localStorage.setItem('userProfileId', result.profile.id);
        localStorage.setItem('onboardingCompleted', 'true');
        
        // Call completion callback with profile data
        onComplete(result.profile);
      } else {
        console.error('Failed to save profile to Supabase:', result.error);
        // Fallback to localStorage
        localStorage.setItem('onboardingData', JSON.stringify(formData));
        localStorage.setItem('onboardingCompleted', 'true');
        onComplete(formData);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Fallback to localStorage
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete(formData);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 relative z-50">
      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to AI Sprint Planner</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          
          {/* Progress Dots */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-blue-600 text-white'
                        : currentStep === step.id
                        ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                currentStep={currentStep}
                totalSteps={totalSteps}
                completeOnboarding={completeOnboarding}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

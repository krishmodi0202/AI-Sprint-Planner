import { useState, useEffect } from 'react';

export const useGuidance = ({ isSignedIn, prdText, selectedWeeks, sprintPlan, loading }) => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    // Determine current step based on user progress
    if (!isSignedIn) {
      setCurrentStep('signin');
    } else if (isSignedIn && !completedSteps.has('signin')) {
      setCompletedSteps(prev => new Set([...prev, 'signin']));
      setCurrentStep('prd');
    } else if (!prdText.trim()) {
      setCurrentStep('prd');
    } else if (prdText.trim() && !completedSteps.has('prd')) {
      setCompletedSteps(prev => new Set([...prev, 'prd']));
      setCurrentStep('weeks');
    } else if (!sprintPlan && !loading) {
      setCurrentStep('weeks');
    } else if (sprintPlan && !completedSteps.has('generate')) {
      setCompletedSteps(prev => new Set([...prev, 'generate']));
      setCurrentStep('review');
    } else {
      setCurrentStep('complete');
    }
  }, [isSignedIn, prdText, sprintPlan, loading, completedSteps]);

  const getProgressPercentage = () => {
    const totalSteps = 4;
    return Math.min((completedSteps.size / totalSteps) * 100, 100);
  };

  return {
    currentStep,
    completedSteps,
    progressPercentage: getProgressPercentage()
  };
};

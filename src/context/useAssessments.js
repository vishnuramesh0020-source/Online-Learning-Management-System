import { useContext } from 'react';
import { AssessmentContext } from './contexts';

export const useAssessments = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessments must be used within an AssessmentProvider');
  }
  return context;
};

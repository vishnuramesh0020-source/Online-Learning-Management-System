import { useContext } from 'react';
import { InstructorContext } from './contexts';

export const useInstructors = () => {
  const context = useContext(InstructorContext);
  if (!context) {
    throw new Error('useInstructors must be used within an InstructorProvider');
  }
  return context;
};

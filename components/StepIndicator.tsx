import React from 'react';
import { AppStep } from '../types';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps = [
  { id: 'upload', label: 'Cargar CV' },
  { id: 'profile', label: 'Perfil' },
  { id: 'results', label: 'Análisis' },
  { id: 'done', label: 'Optimizado' },
];

const getStepStatus = (stepId: string, currentStep: AppStep) => {
  const stepOrder = ['upload', 'profile', 'analyzing', 'results', 'optimizing', 'done'];
  
  // Normalize intermediate loading states
  let effectiveCurrent = currentStep;
  if (currentStep === 'analyzing') effectiveCurrent = 'results';
  if (currentStep === 'optimizing') effectiveCurrent = 'done';

  const currentIndex = stepOrder.indexOf(effectiveCurrent);
  const stepIndex = stepOrder.indexOf(stepId);

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'pending';
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center space-x-2 md:space-x-8">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, currentStep);
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300
                ${status === 'completed' ? 'bg-blue-600 border-blue-600 text-white' : 
                  status === 'current' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-gray-300 text-gray-300 dark:border-slate-700 dark:text-slate-700'}`}>
                {status === 'completed' ? <Check size={16} /> : <span className="text-sm font-medium">{index + 1}</span>}
              </div>
              <span className={`ml-2 text-sm font-medium hidden md:block transition-colors duration-300
                ${status === 'current' ? 'text-blue-900 dark:text-blue-300' : 'text-gray-500 dark:text-slate-600'}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 md:mx-4 hidden sm:block transition-colors duration-300 ${status === 'completed' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message: string;
  subMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, subMessage }) => {
  return (
    <div className="w-full h-96 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-white p-4 rounded-full shadow-sm border border-slate-100">
           <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
      <h3 className="mt-8 text-xl font-semibold text-slate-800">{message}</h3>
      {subMessage && <p className="mt-2 text-slate-500 text-center max-w-md">{subMessage}</p>}
    </div>
  );
};

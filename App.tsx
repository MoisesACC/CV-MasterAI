import React, { useState, useEffect } from 'react';
import { AppStep, UserProfile, CVAnalysisResult, OptimizedCV } from './types';
import { StepIndicator } from './components/StepIndicator';
import { UploadSection } from './components/UploadSection';
import { ProfileForm } from './components/ProfileForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { OptimizationSection } from './components/OptimizationSection';
import { LoadingScreen } from './components/LoadingScreen';
import { analyzeCV, optimizeCV } from './services/geminiService';
import { BrainCircuit, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedCV | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Theme management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove Data URL prefix (e.g. "data:application/pdf;base64,")
          const base64Content = reader.result.split(',')[1];
          resolve(base64Content);
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      const base64 = await fileToBase64(selectedFile);
      setFileBase64(base64);
      setCurrentStep('profile');
      setError(null);
    } catch (err) {
      setError("Error al procesar el archivo. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  const handleProfileSubmit = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setCurrentStep('analyzing');
    setError(null);

    try {
      if (!fileBase64 || !file) throw new Error("No hay archivo cargado");
      
      const result = await analyzeCV(fileBase64, file.type, userProfile);
      setAnalysisResult(result);
      setCurrentStep('results');
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al analizar el CV con la IA. Asegúrate de usar una API Key válida y que el archivo sea legible.");
      setCurrentStep('profile');
    }
  };

  const handleOptimize = async () => {
    if (!analysisResult || !profile || !fileBase64 || !file) return;
    
    setCurrentStep('optimizing');
    try {
      const result = await optimizeCV(fileBase64, file.type, profile, analysisResult);
      setOptimizedResult(result);
      setCurrentStep('done');
    } catch (err) {
      console.error(err);
      setError("Error al generar la versión optimizada. Por favor intenta de nuevo.");
      setCurrentStep('results');
    }
  };

  const handleRestart = () => {
    setFile(null);
    setFileBase64(null);
    setProfile(null);
    setAnalysisResult(null);
    setOptimizedResult(null);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 no-print transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleRestart}>
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <BrainCircuit size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200">
              CV Master ATS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block border-l border-slate-200 dark:border-slate-700 pl-4 ml-2">
              Potenciado por Gemini 2.5 Flash
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        
        {error && (
          <div className="w-full max-w-2xl bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded shadow-sm flex justify-between items-center no-print">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="font-bold hover:text-red-900 dark:hover:text-red-100">✕</button>
          </div>
        )}

        {/* Stepper (Only show if not in print mode) */}
        <div className="w-full max-w-4xl no-print">
           <StepIndicator currentStep={currentStep} />
        </div>

        {/* Dynamic Content */}
        <div className="w-full mt-6">
          {currentStep === 'upload' && (
            <UploadSection onFileSelect={handleFileSelect} />
          )}

          {currentStep === 'profile' && file && (
            <ProfileForm onSubmit={handleProfileSubmit} fileName={file.name} />
          )}

          {currentStep === 'analyzing' && (
            <LoadingScreen 
              message="Analizando compatibilidad ATS..." 
              subMessage="Estamos escaneando estructura, palabras clave y legibilidad comparando con miles de perfiles exitosos."
            />
          )}

          {currentStep === 'results' && analysisResult && (
            <AnalysisDashboard 
              analysis={analysisResult} 
              onOptimize={handleOptimize} 
            />
          )}

          {currentStep === 'optimizing' && (
             <LoadingScreen 
               message="Redactando tu CV Profesional..." 
               subMessage="Aplicando verbos de acción, corrigiendo formato y optimizando palabras clave para el puesto seleccionado."
             />
          )}

          {currentStep === 'done' && optimizedResult && (
            <OptimizationSection 
              optimizedData={optimizedResult} 
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto no-print transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} CV Master ATS. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">Esta herramienta utiliza IA avanzada. Siempre revisa el resultado final antes de enviarlo.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
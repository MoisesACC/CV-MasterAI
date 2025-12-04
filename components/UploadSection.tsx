import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, AlertCircle, X } from 'lucide-react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndPassFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    // Allow standard Word docs or PDFs. 
    // Note: Browser MIME type detection can vary, so we also check extension.
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    // We ideally want PDF for Gemini, but we'll accept basic text handling. 
    // Gemini handles PDF input best.
    
    if (!isPdf) {
      setError("Por favor sube un archivo PDF para asegurar que la IA pueda leerlo correctamente.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo no debe superar los 5MB.");
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Sube tu Currículum</h2>
        <p className="text-slate-500 mt-2">Analizaremos tu CV en busca de compatibilidad con sistemas ATS.</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
            <UploadCloud size={40} className={isDragging ? 'text-blue-600' : 'text-slate-400'} />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-700">
              Arrastra tu archivo aquí o <span className="text-blue-600">haz clic para buscar</span>
            </p>
            <p className="text-sm text-slate-400">
              Soportado: PDF (Recomendado)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 animate-pulse">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
            <FileText size={18} className="text-blue-500" />
            <span>Extracción de Texto</span>
          </div>
          <p className="text-xs text-slate-500">Tecnología OCR y parsing avanzado para leer tu CV como lo haría un robot.</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
            <AlertCircle size={18} className="text-amber-500" />
            <span>Detección de Errores</span>
          </div>
          <p className="text-xs text-slate-500">Identifica problemas de formato, tablas rotas y fuentes ilegibles.</p>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
            <UploadCloud size={18} className="text-green-500" />
            <span>100% Seguro</span>
          </div>
          <p className="text-xs text-slate-500">Tu privacidad es primero. Los archivos se procesan y no se almacenan permanentemente.</p>
        </div>
      </div>
    </div>
  );
};

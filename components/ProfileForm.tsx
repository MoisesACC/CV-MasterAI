import React, { useState } from 'react';
import { UserProfile, ExperienceLevel } from '../types';
import { EXPERIENCE_LEVELS } from '../constants';
import { Briefcase, Building, Target, Zap } from 'lucide-react';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  fileName: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, fileName }) => {
  const [formData, setFormData] = useState<UserProfile>({
    jobTitle: '',
    industry: '',
    level: ExperienceLevel.MID,
    keywords: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.jobTitle && formData.industry) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Configura tu Perfil Objetivo</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analizando archivo: <span className="font-medium text-slate-700 dark:text-slate-300">{fileName}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Briefcase size={16} />
                Puesto Objetivo
              </label>
              <input
                type="text"
                required
                placeholder="ej. Desarrollador Frontend"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Building size={16} />
                Industria / Sector
              </label>
              <input
                type="text"
                required
                placeholder="ej. Tecnología / Finanzas"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Target size={16} />
              Nivel de Experiencia
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPERIENCE_LEVELS.map((level) => (
                <div
                  key={level.value}
                  onClick={() => setFormData({ ...formData, level: level.value })}
                  className={`
                    cursor-pointer p-3 rounded-lg border text-sm transition-all
                    ${formData.level === level.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'}
                  `}
                >
                  {level.label}
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Zap size={16} />
              Palabras Clave Específicas (Opcional)
            </label>
            <textarea
              placeholder="ej. React, TypeScript, Gestión de Proyectos, Ventas B2B (separadas por comas)"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">Si dejas esto vacío, la IA deducirá las palabras clave según el puesto.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
            >
              Iniciar Análisis ATS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
import React from 'react';
import { OptimizedCV, CVStructuredData } from '../types';
import { Download, Printer, CheckCircle, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface OptimizationSectionProps {
  optimizedData: OptimizedCV;
  onRestart: () => void;
}

// Internal Component for the Resume Template
// This intentionally does NOT use dark mode classes because it represents paper/document
const ResumeTemplate: React.FC<{ data: CVStructuredData }> = ({ data }) => {
  return (
    <div className="w-full bg-white text-slate-900 font-sans" id="cv-template">
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900 mb-2">{data.fullName}</h1>
        <p className="text-xl text-slate-600 font-medium mb-4">{data.title}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {data.contact.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="text-slate-800" />
              <span>{data.contact.email}</span>
            </div>
          )}
          {data.contact.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="text-slate-800" />
              <span>{data.contact.phone}</span>
            </div>
          )}
          {data.contact.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-800" />
              <span>{data.contact.location}</span>
            </div>
          )}
          {data.contact.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={14} className="text-slate-800" />
              <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
            </div>
          )}
          {data.contact.portfolio && (
            <div className="flex items-center gap-1.5">
              <Globe size={14} className="text-slate-800" />
              <a href={data.contact.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">Portafolio</a>
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 mb-3 pb-1">
          Perfil Profesional
        </h2>
        <p className="text-sm leading-relaxed text-slate-700 text-justify">
          {data.professionalSummary}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 mb-4 pb-1">
          Experiencia Laboral
        </h2>
        <div className="space-y-5">
          {data.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-900 text-base">{exp.position}</h3>
                <span className="text-sm font-semibold text-slate-600 shrink-0">{exp.startDate} – {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline mb-2 text-sm">
                <span className="font-semibold text-slate-700 italic">{exp.company}</span>
                <span className="text-slate-500">{exp.location}</span>
              </div>
              <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-700">
                {exp.achievements.map((ach, i) => (
                  <li key={i} className="pl-1">{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects (Optional) */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 mb-4 pb-1">
            Proyectos Destacados
          </h2>
          <div className="space-y-4">
            {data.projects.map((proj, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  {proj.name} <span className="font-normal text-slate-600 text-xs mx-1">|</span> <span className="font-medium text-slate-600 text-xs italic">{proj.technologies}</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 mb-4 pb-1">
          Educación
        </h2>
        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                <p className="text-sm text-slate-600 italic">{edu.institution}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-600">{edu.year}</p>
                <p className="text-xs text-slate-500">{edu.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 mb-4 pb-1">
          Habilidades
        </h2>
        <div className="grid grid-cols-1 gap-y-2 text-sm">
          {data.skills.technical && data.skills.technical.length > 0 && (
            <div className="flex gap-2">
              <span className="font-bold text-slate-900 min-w-[120px]">Técnicas:</span>
              <span className="text-slate-700">{data.skills.technical.join(', ')}</span>
            </div>
          )}
          {data.skills.tools && data.skills.tools.length > 0 && (
             <div className="flex gap-2">
              <span className="font-bold text-slate-900 min-w-[120px]">Herramientas:</span>
              <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
            </div>
          )}
          {data.skills.languages && data.skills.languages.length > 0 && (
            <div className="flex gap-2">
              <span className="font-bold text-slate-900 min-w-[120px]">Idiomas:</span>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
           {data.skills.soft && data.skills.soft.length > 0 && (
            <div className="flex gap-2">
              <span className="font-bold text-slate-900 min-w-[120px]">Competencias:</span>
              <span className="text-slate-700">{data.skills.soft.join(', ')}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export const OptimizationSection: React.FC<OptimizationSectionProps> = ({ optimizedData, onRestart }) => {
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const d = optimizedData.structuredContent;
    let text = `${d.fullName}\n${d.title}\n\n`;
    text += `Email: ${d.contact.email} | Tel: ${d.contact.phone} | Loc: ${d.contact.location}\n\n`;
    text += `PERFIL PROFESIONAL\n${d.professionalSummary}\n\n`;
    text += `EXPERIENCIA\n`;
    d.experience.forEach(exp => {
      text += `${exp.position} - ${exp.company} (${exp.startDate} - ${exp.endDate})\n`;
      exp.achievements.forEach(a => text += `- ${a}\n`);
      text += `\n`;
    });
    
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "CV_Optimizado.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12 animate-fade-in">
      
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8 text-center no-print transition-colors">
        <div className="flex justify-center mb-3">
          <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full">
            <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">¡Tu CV ha sido optimizado!</h2>
        <p className="text-green-700 dark:text-green-300 mt-2 max-w-2xl mx-auto">
          Hemos rediseñado tu currículum utilizando una estructura probada para sistemas ATS. 
          El formato es limpio, profesional y jerarquizado para maximizar la legibilidad.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Vista Previa del Documento</h3>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Descargar Texto</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Printer size={18} />
            <span>Guardar como PDF</span>
          </button>
        </div>
      </div>

      {/* Document Preview Container */}
      <div className="bg-slate-200 dark:bg-slate-800 p-4 md:p-8 rounded-lg overflow-x-auto no-print flex justify-center transition-colors">
        <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[15mm] md:p-[20mm] origin-top scale-100 md:scale-95 lg:scale-100 shrink-0">
          <ResumeTemplate data={optimizedData.structuredContent} />
        </div>
      </div>

      {/* Print Only Section */}
      <div className="hidden print-only">
        <div className="w-[100%] h-[100%] p-[10mm] bg-white text-black">
          <ResumeTemplate data={optimizedData.structuredContent} />
        </div>
      </div>

      <div className="mt-12 text-center no-print">
        <button 
          onClick={onRestart}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium underline transition-colors"
        >
          Comenzar nuevo análisis
        </button>
      </div>
    </div>
  );
};
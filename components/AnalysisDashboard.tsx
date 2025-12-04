import React from 'react';
import { CVAnalysisResult, SectionAnalysis } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Download, Wand2 } from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: CVAnalysisResult;
  onOptimize: () => void;
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  
  let color = '#ef4444'; // red
  if (score > 50) color = '#eab308'; // yellow
  if (score > 75) color = '#22c55e'; // green

  return (
    <div className="relative h-48 w-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={5}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-4xl font-bold text-slate-800">{score}%</span>
        <span className="text-sm text-slate-500 font-medium">ATS Score</span>
      </div>
    </div>
  );
};

const SectionCard: React.FC<{ title: string; data: SectionAnalysis }> = ({ title, data }) => {
  const getIcon = () => {
    switch (data.status) {
      case 'good': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'critical': return <XCircle className="text-red-500" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (data.status) {
      case 'good': return 'bg-green-50 border-green-100';
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'critical': return 'bg-red-50 border-red-100';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {getIcon()}
      </div>
      <div className="space-y-2">
        {data.feedback.map((item, idx) => (
          <p key={idx} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
            {item}
          </p>
        ))}
      </div>
      <div className="mt-3 text-xs font-bold text-slate-500 text-right">
        Score Sección: {data.score}/100
      </div>
    </div>
  );
};

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, onOptimize }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header Summary */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-shrink-0">
          <ScoreGauge score={analysis.overallScore} />
        </div>
        <div className="flex-grow space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Diagnóstico General</h2>
          <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
          
          <div className="flex flex-wrap gap-3">
             <div className={`px-3 py-1 rounded-full text-xs font-medium border
                ${analysis.formatting.isClean ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                Formato {analysis.formatting.isClean ? 'Limpio' : 'Problemático'}
             </div>
             <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
               Densidad Keywords: {analysis.atsKeywords.densityScore}%
             </div>
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Información de Contacto" data={analysis.contactInfo} />
        <SectionCard title="Perfil Profesional" data={analysis.professionalSummary} />
        <SectionCard title="Experiencia Laboral" data={analysis.experience} />
        <SectionCard title="Educación & Formación" data={analysis.education} />
        <SectionCard title="Habilidades (Skills)" data={analysis.skills} />
        
        {/* Keywords Special Card */}
        <div className="p-4 rounded-lg border bg-white border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Palabras Clave ATS</h3>
            <span className="text-xs font-medium text-slate-500">Gap Analysis</span>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-green-600 font-semibold mb-1">Encontradas:</p>
              <div className="flex flex-wrap gap-1">
                {analysis.atsKeywords.found.map(k => (
                  <span key={k} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">{k}</span>
                ))}
                {analysis.atsKeywords.found.length === 0 && <span className="text-xs text-gray-400">Ninguna relevante detectada</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-red-600 font-semibold mb-1">Faltantes (Crítico):</p>
              <div className="flex flex-wrap gap-1">
                {analysis.atsKeywords.missing.map(k => (
                  <span key={k} className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations & Action */}
      <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Plan de Mejora Recomendado</h3>
        <ul className="space-y-3 mb-8">
          {analysis.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <ChevronRight className="text-blue-400 flex-shrink-0 mt-1" size={18} />
              <span className="text-slate-200">{rec}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-slate-700 pt-6">
          <button 
            onClick={onOptimize}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-blue-500/25"
          >
            <Wand2 size={20} />
            Generar CV Optimizado con IA
          </button>
        </div>
      </div>

    </div>
  );
};

export enum ExperienceLevel {
  JUNIOR = 'Junior (0-2 años)',
  MID = 'Semi-Senior (3-5 años)',
  SENIOR = 'Senior (5-8 años)',
  EXECUTIVE = 'Ejecutivo (+10 años)',
}

export interface UserProfile {
  jobTitle: string;
  industry: string;
  level: ExperienceLevel;
  keywords: string;
}

export interface SectionAnalysis {
  status: 'good' | 'warning' | 'critical';
  score: number;
  feedback: string[];
}

export interface CVAnalysisResult {
  overallScore: number; // 0-100
  summary: string;
  contactInfo: SectionAnalysis;
  professionalSummary: SectionAnalysis;
  experience: SectionAnalysis;
  education: SectionAnalysis;
  skills: SectionAnalysis;
  atsKeywords: {
    found: string[];
    missing: string[];
    densityScore: number;
  };
  formatting: {
    isClean: boolean;
    issues: string[];
  };
  recommendations: string[];
}

// Structured CV Data for Template Rendering
export interface CVExperience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

export interface CVEducation {
  institution: string;
  degree: string;
  location: string;
  year: string;
}

export interface CVProject {
  name: string;
  description: string;
  technologies: string;
}

export interface CVStructuredData {
  fullName: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    linkedin?: string;
    location: string;
    portfolio?: string;
  };
  professionalSummary: string;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
    languages: string[];
  };
  experience: CVExperience[];
  education: CVEducation[];
  projects?: CVProject[];
}

export interface OptimizedCV {
  structuredContent: CVStructuredData;
}

export type AppStep = 'upload' | 'profile' | 'analyzing' | 'results' | 'optimizing' | 'done';

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CVAnalysisResult, UserProfile, OptimizedCV } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

// Define the Schema for Analysis Response
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "Puntuación general ATS del 0 al 100" },
    summary: { type: Type.STRING, description: "Resumen ejecutivo del diagnóstico del CV" },
    contactInfo: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ["good", "warning", "critical"] },
        score: { type: Type.INTEGER },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    professionalSummary: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ["good", "warning", "critical"] },
        score: { type: Type.INTEGER },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    experience: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ["good", "warning", "critical"] },
        score: { type: Type.INTEGER },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    education: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ["good", "warning", "critical"] },
        score: { type: Type.INTEGER },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    skills: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ["good", "warning", "critical"] },
        score: { type: Type.INTEGER },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    atsKeywords: {
      type: Type.OBJECT,
      properties: {
        found: { type: Type.ARRAY, items: { type: Type.STRING } },
        missing: { type: Type.ARRAY, items: { type: Type.STRING } },
        densityScore: { type: Type.INTEGER }
      }
    },
    formatting: {
      type: Type.OBJECT,
      properties: {
        isClean: { type: Type.BOOLEAN },
        issues: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de acciones concretas para mejorar el CV"
    }
  }
};

// Define Schema for Optimized CV (Structured Data)
const optimizedCVSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING },
    title: { type: Type.STRING, description: "Título profesional optimizado para el puesto" },
    contact: {
      type: Type.OBJECT,
      properties: {
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        location: { type: Type.STRING },
        portfolio: { type: Type.STRING }
      },
      required: ["email", "phone"]
    },
    professionalSummary: { type: Type.STRING, description: "Perfil profesional optimizado (3-4 líneas)" },
    skills: {
      type: Type.OBJECT,
      properties: {
        technical: { type: Type.ARRAY, items: { type: Type.STRING } },
        soft: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } },
        languages: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          position: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          achievements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de logros cuantificables y responsabilidades clave comenzando con verbos de acción" }
        }
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          location: { type: Type.STRING },
          year: { type: Type.STRING }
        }
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: { type: Type.STRING }
        }
      }
    }
  },
  required: ["fullName", "title", "contact", "professionalSummary", "experience", "education", "skills"]
};

export const analyzeCV = async (
  fileBase64: string,
  mimeType: string,
  profile: UserProfile
): Promise<CVAnalysisResult> => {
  try {
    const prompt = `
      Actúa como un sistema experto ATS (Applicant Tracking System) y un reclutador senior especializado en el mercado hispanohablante.
      
      Analiza el siguiente Currículum Vitae (proporcionado como archivo adjunto).
      
      CONTEXTO DEL CANDIDATO:
      - Puesto objetivo: ${profile.jobTitle}
      - Industria: ${profile.industry}
      - Nivel de experiencia: ${profile.level}
      - Palabras clave objetivo: ${profile.keywords}

      TAREA:
      Evalúa el CV rigurosamente contra criterios ATS estándar:
      1. Legibilidad y Formato (sin tablas complejas, fuentes estándar).
      2. Contenido (uso de verbos de acción, logros cuantificables).
      3. Palabras clave (coincidencia con el puesto objetivo).
      4. Estructura (Contacto, Resumen, Experiencia Inversa, Educación, Habilidades).

      Devuelve un análisis detallado en formato JSON siguiendo estrictamente el esquema proporcionado.
      El idioma de respuesta debe ser ESPAÑOL.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: fileBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for consistent analysis
      }
    });

    const text = response.text;
    if (!text) throw new Error("No se generó respuesta del análisis.");
    
    return JSON.parse(text) as CVAnalysisResult;

  } catch (error) {
    console.error("Error en analyzeCV:", error);
    throw error;
  }
};

export const optimizeCV = async (
  fileBase64: string,
  mimeType: string,
  profile: UserProfile,
  analysis: CVAnalysisResult
): Promise<OptimizedCV> => {
  try {
    const prompt = `
      Eres un redactor profesional de CVs experto en optimización ATS (Applicant Tracking Systems).
      
      Tu tarea es REESTRUCTURAR y REESCRIBIR el currículum adjunto para maximizar sus posibilidades de pasar filtros ATS para un puesto de "${profile.jobTitle}".
      
      INSTRUCCIONES DE REESCRITURA:
      1. Extrae y estructura la información en un formato JSON estricto.
      2. Incorpora las palabras clave faltantes detectadas: ${analysis.atsKeywords.missing.join(', ')}.
      3. Reescribe las descripciones de experiencia ("achievements") usando verbos de acción fuertes (ej: "Lideré", "Desarrollé", "Optimicé") y enfócate en logros cuantificables (datos, % de mejora).
      4. Optimiza el perfil profesional ("professionalSummary") para que sea contundente y alineado al rol de ${profile.level}.
      5. Asegúrate de corregir ortografía y gramática.
      6. Elimina información irrelevante.
      7. El resultado debe estar completamente en ESPAÑOL.
      
      IMPORTANTE:
      - Si el CV original no tiene proyectos, puedes omitir esa sección, pero si hay proyectos importantes, inclúyelos.
      - Separa las habilidades en Categorías (Técnicas, Blandas, Herramientas).

      Devuelve SOLAMENTE el objeto JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: fileBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: optimizedCVSchema,
        temperature: 0.4,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No se generó el CV optimizado.");

    const structuredContent = JSON.parse(text);

    return { structuredContent };

  } catch (error) {
    console.error("Error en optimizeCV:", error);
    throw error;
  }
};

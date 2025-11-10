

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the AI client only if the API key exists to prevent crashing the app on startup.
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

export const suggestDescription = async (prompt: string): Promise<string> => {
  if (!ai) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
    return "Fonctionnalité IA désactivée. Clé API manquante.";
  }
  
  try {
    // FIX: Use systemInstruction for persona and instructions, and 'contents' for the user prompt.
    const systemInstruction = `Vous êtes un mécanicien professionnel. Rédigez une description de service brève et professionnelle pour le devis d'un client en vous basant sur cette saisie. Par exemple, si l'entrée est 'vidange', vous pourriez suggérer 'Effectuer la vidange moteur et le remplacement du filtre avec de l'huile synthétique.'. Restez concis et clair. Ne retournez que la description.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    
    // FIX: Use response.text as per guidelines.
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Erreur lors de la suggestion de description.";
  }
};

import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AppSpecification, ArchitectResponse } from "../types";

// Safely access process.env for browser compatibility
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();

const getAiClient = () => new GoogleGenAI({ apiKey });

export const generateAppSpecification = async (prompt: string): Promise<AppSpecification> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = getAiClient();

  const systemInstruction = `
    You are an expert Android App Architect. 
    Analyze the user's request and output a high-level JSON specification for the app.
    
    The response must be a valid JSON object matching the schema provided.
    Ensure 'offline' is true if the user mentions offline capabilities, database, or local storage.
    Extract key screens and features from the description.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            app_name: { type: Type.STRING, description: "Suggested name for the application" },
            screens: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of screens/activities in the app"
            },
            features: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Key technical features (e.g., Auth, Database, Camera)"
            },
            theme: { type: Type.STRING, description: "Visual theme (e.g., dark, light, colorful)" },
            offline: { type: Type.BOOLEAN, description: "Whether the app requires offline support" }
          },
          required: ["app_name", "screens", "features", "theme", "offline"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AppSpecification;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

let chatSession: Chat | null = null;

export const sendMessageToArchitect = async (message: string, currentSpec?: AppSpecification): Promise<ArchitectResponse> => {
    if (!apiKey) throw new Error("API Key is missing.");
    const ai = getAiClient();

    if (!chatSession) {
        chatSession = ai.chats.create({
            model: "gemini-3-flash-preview",
            config: {
                systemInstruction: `
                    You are a friendly and technical Android App Architect. 
                    Your goal is to chat with the user to clarify their app requirements.
                    
                    With EVERY response, you MUST return a JSON object containing:
                    1. 'reply': A conversational response to the user.
                    2. 'spec': The current understanding of the App Specification based on the ENTIRE conversation.
                    
                    Start with a default empty spec if not provided.
                    If the user changes their mind (e.g. "actually make it dark mode"), update the spec accordingly.
                `,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        reply: { type: Type.STRING },
                        spec: {
                            type: Type.OBJECT,
                            properties: {
                                app_name: { type: Type.STRING },
                                screens: { type: Type.ARRAY, items: { type: Type.STRING } },
                                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                                theme: { type: Type.STRING },
                                offline: { type: Type.BOOLEAN }
                            },
                            required: ["app_name", "screens", "features", "theme", "offline"]
                        }
                    },
                    required: ["reply", "spec"]
                }
            }
        });
    }

    try {
        const response = await chatSession.sendMessage({ 
            message: message 
        });
        
        const text = response.text;
        if (!text) throw new Error("No response from Architect.");
        
        return JSON.parse(text) as ArchitectResponse;
    } catch (e) {
        console.error("Chat Error", e);
        throw e;
    }
};

export const resetChat = () => {
    chatSession = null;
};
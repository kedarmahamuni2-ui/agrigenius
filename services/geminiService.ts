
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import type { MarketSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const diagnoseCrop = async (imageDataBase64: string, mimeType: string) => {
    const imagePart = fileToGenerativePart(imageDataBase64, mimeType);
    const textPart = {
        text: `You are an expert agronomist and plant pathologist. Analyze this image of a plant. Identify if it's healthy or diseased. If diseased, provide the common name, a description, common causes, and suggest 2-3 organic and chemical treatment options. Respond in the requested JSON format.`
    };
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        is_healthy: {
                            type: Type.BOOLEAN,
                            description: 'Is the plant in the image healthy?'
                        },
                        disease: {
                            type: Type.STRING,
                            description: 'The common name of the disease or pest. "None" if healthy.'
                        },
                        description: {
                            type: Type.STRING,
                            description: 'A brief description of the disease/pest and its symptoms.'
                        },
                        causes: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of common causes for this issue.'
                        },
                        organic_treatments: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of 2-3 suggested organic treatment options.'
                        },
                        chemical_treatments: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of 2-3 suggested chemical treatment options.'
                        }
                    },
                    required: ["is_healthy", "disease", "description", "causes", "organic_treatments", "chemical_treatments"]
                }
            }
        });
        const parsedResponse = JSON.parse(response.text);
        return parsedResponse;
    } catch (error) {
        console.error("Error diagnosing crop:", error);
        throw new Error("Failed to get a diagnosis from the AI. Please try again.");
    }
};

export const createFarmingChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are AgriBot, a friendly and knowledgeable AI farming assistant. Your goal is to provide clear, practical, and helpful advice to farmers on a wide range of agricultural topics. Be concise and easy to understand.',
        },
    });
};

export const getMarketTrend = async (cropName: string) => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: `Provide a brief market analysis and trend summary for ${cropName} based on recent news. Focus on price, demand, and future outlook in 3-4 sentences.`,
           config: {
             tools: [{googleSearch: {}}],
           },
        });

        const summary = response.text;
        const sources: MarketSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks as MarketSource[] || [];

        return { summary, sources };
    } catch (error) {
        console.error("Error getting market trend:", error);
        throw new Error("Failed to retrieve market trends. The AI may be busy, please try again later.");
    }
};

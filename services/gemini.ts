import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const API_KEY = process.env.API_KEY || '';

export const GeminiService = {
  async getFinancialAdvice(transactions: Transaction[]): Promise<string> {
    if (!API_KEY) {
        return "API Key is missing. Please configure your environment variables.";
    }
    
    // Prepare a summary to save tokens, taking last 50 transactions
    const recent = transactions.slice(0, 50);
    const summaryJSON = JSON.stringify(recent);

    const prompt = `
      You are a financial advisor. Analyze the following JSON transaction data:
      ${summaryJSON}
      
      Please provide:
      1. A brief summary of spending habits.
      2. Constructive advice on how to save money.
      3. Identify any unusual or high spending categories.
      
      Keep the tone professional yet encouraging. Format using Markdown.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "Could not generate insights at this time.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "An error occurred while communicating with the AI advisor.";
    }
  }
};
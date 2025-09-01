import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Transaction } from '../types';

// Ensure the API key is available, but do not hardcode it.
// This relies on the environment being set up correctly.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const model = ai.chats;

const systemInstruction = `You are Zenith, a helpful and friendly AI financial assistant for Zenith Digital Bank.
Your role is to analyze the user's transaction data and provide clear, concise, and insightful answers to their questions.
You must only answer questions related to the provided financial data.
Do not provide investment advice or suggestions to use other financial products.
Be professional and secure in your tone.
Please respond in the same language as the user's query.
The user's transaction history is provided below in JSON format.
---
TRANSACTION HISTORY:
`;

export const getAIResponse = async (
  chat: Chat | null,
  transactions: Transaction[],
  userQuery: string
): Promise<{ response: string; updatedChat: Chat }> => {
  if (!apiKey) {
    return {
      response: "The AI assistant is currently unavailable. The API key is not configured.",
      updatedChat: chat as Chat,
    };
  }

  try {
    let currentChat = chat;

    if (!currentChat) {
      const transactionHistoryString = JSON.stringify(transactions, null, 2);
      const initialContent = `${systemInstruction}${transactionHistoryString}`;
      
      currentChat = model.create({
        model: 'gemini-2.5-flash',
        history: [{ role: 'user', parts: [{ text: initialContent }] }],
      });
    }

    const result: GenerateContentResponse = await currentChat.sendMessage({ message: userQuery });
    const responseText = result.text;
    
    return { response: responseText, updatedChat: currentChat };
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return {
      response: "Sorry, I encountered an error while processing your request. Please try again later.",
      updatedChat: chat as Chat,
    };
  }
};
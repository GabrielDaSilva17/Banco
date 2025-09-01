import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Transaction } from '../types';

// Ensure the API key is available, but do not hardcode it.
// This relies on the environment being set up correctly.
// FIX: Use process.env.API_KEY as per the guidelines to fix TypeScript error with import.meta.env.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  // FIX: Updated error message to reflect the correct environment variable.
  console.error("API_KEY environment variable not set.");
}
// FIX: Pass apiKey from process.env.
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const model = ai.chats;

// FIX: System instruction updated to be used with the `systemInstruction` config parameter.
// The transaction history will be passed separately in the chat history.
const systemInstruction = `You are Zenith, a helpful and friendly AI financial assistant for Zenith Digital Bank.
Your role is to analyze the user's transaction data and provide clear, concise, and insightful answers to their questions.
You must only answer questions related to the provided financial data.
Do not provide investment advice or suggestions to use other financial products.
Be professional and secure in your tone.
Please respond in the same language as the user's query.
The user's transaction history is provided in the chat history.
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
      // FIX: The transaction history is passed in the initial user message.
      const initialUserMessage = `TRANSACTION HISTORY:\n${transactionHistoryString}`;
      
      currentChat = model.create({
        model: 'gemini-2.5-flash',
        // FIX: Use config.systemInstruction for setting the model's persona, as per guidelines.
        config: {
          systemInstruction,
        },
        history: [{ role: 'user', parts: [{ text: initialUserMessage }] }],
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
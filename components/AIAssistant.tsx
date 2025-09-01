
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage, Sender, Transaction } from '../types';
import { getAIResponse } from '../services/geminiService';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { SparklesIcon, SendIcon } from '../constants/icons';
import { Chat } from '@google/genai';

interface AIAssistantProps {
  transactions: Transaction[];
  isMobileView: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ transactions, isMobileView }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      text: t('aiAssistant.initialMessage'),
      sender: Sender.AI,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(prev => 
        prev.map(msg => 
            msg.id === 'initial' ? { ...msg, text: t('aiAssistant.initialMessage') } : msg
        )
    );
  }, [t]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: Sender.USER,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { response, updatedChat } = await getAIResponse(chat, transactions, inputValue);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: Sender.AI,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setChat(updatedChat);

    } catch (error) {
       const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: t('aiAssistant.errorMessage'),
        sender: Sender.AI,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const cardHeightClass = isMobileView ? 'h-[calc(100vh-160px)]' : 'h-[calc(100vh-120px)]';

  return (
    <Card className={`${cardHeightClass} flex flex-col`}>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
        <SparklesIcon className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-slate-100">{t('aiAssistant.title')}</h3>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.sender === Sender.USER ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === Sender.AI && (
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-cyan-400" />
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-sm xl:max-w-md p-3 rounded-2xl ${
                  message.sender === Sender.USER
                    ? 'bg-cyan-500 text-white rounded-br-lg'
                    : 'bg-slate-700 text-slate-200 rounded-bl-lg'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-end gap-2 justify-start">
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="max-w-xs md:max-w-md lg:max-w-sm xl:max-w-md p-3 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-lg">
                    <Spinner className="w-5 h-5" />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center bg-slate-700 rounded-xl p-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('aiAssistant.inputPlaceholder')}
            className="flex-grow bg-transparent px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-9 h-9 flex items-center justify-center bg-cyan-500 rounded-lg text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
          >
            {isLoading ? <Spinner className="w-5 h-5"/> : <SendIcon className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </Card>
  );
};

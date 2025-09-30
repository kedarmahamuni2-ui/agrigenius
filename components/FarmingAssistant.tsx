
import React, { useState, useEffect, useRef } from 'react';
import { createFarmingChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import type { Chat } from '@google/genai';
import Spinner from './Spinner';

const FarmingAssistant: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const chatInstance = createFarmingChat();
      setChat(chatInstance);
      
      // Start with a welcome message
      const welcomeMessage: ChatMessage = {
        role: 'model',
        text: 'Hello! I am AgriBot, your AI farming assistant. How can I help you today? You can ask me about planting schedules, soil health, pest control, and more.'
      };
      setMessages([welcomeMessage]);
      setLoading(false);
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: input });
      
      let newModelMessage: ChatMessage = { role: 'model', text: '' };
      setMessages(prev => [...prev, newModelMessage]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'model') {
                return [...prev.slice(0, -1), { ...lastMessage, text: lastMessage.text + chunkText }];
            }
            return prev;
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-brand-green">Farming Assistant</h2>
        <p className="text-gray-600 mt-2">Chat with our AI expert to get instant farming advice.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg flex flex-col" style={{height: '60vh'}}>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-brand-light-green text-white' : 'bg-gray-200 text-brand-brown'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && messages[messages.length-1]?.role === 'user' && (
              <div className="flex justify-start">
                  <div className="bg-gray-200 text-brand-brown px-4 py-3 rounded-2xl">
                     <Spinner />
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your crops..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-light-green"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-brand-light-green text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-green disabled:bg-gray-400"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmingAssistant;

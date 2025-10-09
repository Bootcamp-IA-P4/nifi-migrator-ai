import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { askChatbot } from '../../services/chatbot';

const ChatbotWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy el asistente de NiFi Migrator AI. ¿Cómo puedo ayudarte?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    const userQuestion = input;
    setInput('');
    setIsLoading(true);

    const response = await askChatbot(userQuestion);

    const botResponse = {
      id: messages.length + 2, 
      text: response.answer || response.error || "Lo siento, ocurrió un error inesperado.",
      sender: 'bot',
    };
    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  };

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 w-full max-w-sm rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <header className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#0b173d] via-[#1a2b6d] to-[#2663EB] p-4 text-white">
        <h3 className="text-lg font-semibold">Asistente NiFi</h3>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20">
          <X size={20} />
        </button>
      </header>

      <div className="h-96 overflow-y-auto bg-gray-50 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-xs rounded-2xl px-4 py-2 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <p className="rounded-2xl rounded-bl-none bg-gray-200 px-4 py-2 text-gray-500">
              Escribiendo...
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center border-t p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          className="flex-grow rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="ml-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatbotWidget;
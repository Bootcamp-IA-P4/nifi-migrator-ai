import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatbotButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
      aria-label="Abrir chat de ayuda"
    >
      <MessageSquare size={32} />
    </button>
  );
};

export default ChatbotButton;
import React, { useState } from 'react';
import ChatbotButton from './ChatbotButton';
import ChatbotWidget from './ChatbotWidget';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatbotButton onClick={() => setIsOpen(true)} />
      <ChatbotWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Chatbot;
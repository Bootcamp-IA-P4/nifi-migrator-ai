import axios from 'axios';

const API_URL = 'https://nifi-migrator-ai-backend.onrender.com';

export const askChatbot = async (question) => {
  try {
    const response = await axios.post(`${API_URL}/chatbot`, {
      question: question,
    });
    return response.data;
  } catch (error) {
    console.error('Error al contactar al chatbot:', error.response?.data || error.message);
    return { error: 'No se pudo obtener una respuesta. Inténtalo de nuevo.' };
  }
};
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

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
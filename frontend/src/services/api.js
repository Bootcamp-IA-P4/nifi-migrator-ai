// src/services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 600000, // 10 minutos de timeout
});


// --- FUNCIÓN AUXILIAR PARA DESCARGA DE PDF ---
const handlePdfDownload = (response) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  
  const contentDisposition = response.headers["content-disposition"];
  let fileName = "migration-report.pdf"; 
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
    if (fileNameMatch && fileNameMatch.length > 1) {
      fileName = fileNameMatch[1];
    }
  }
  
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// --- SERVICIOS EXPORTABLES ---
// Servicio principal para analizar un flujo
export const analyzeFlow = async (file, generatePdf = false) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("generate_pdf", generatePdf);

  try {
    const response = await api.post("/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: generatePdf ? "blob" : "json", 
    });

    if (generatePdf) {
      handlePdfDownload(response);
      return { status: "pdf_download_initiated" };
    }
    
    return response.data; 
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message;
    console.error("Error en analyzeFlow:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * 3. SERVICIO PARA OBTENER TODOS LOS FLUJOS GUARDADOS
 */
export const getAllFlows = async () => {
  try {
    const response = await api.get("/storage/flows");
    return response.data.files; 
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message;
    console.error("Error en getAllFlows:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * 4. SERVICIO PARA SUBIR UN TEMPLATE (SIMULACIÓN DE REGISTRY)
 */
export const uploadTemplate = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/storage/upload_template", formData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message;
    console.error("Error en uploadTemplate:", errorMsg);
    throw new Error(errorMsg);
  }
};

// función para descargar el pdf:

export const downloadPdfByReportId = async (reportId) => {
  if (!reportId) {
    throw new Error("Se requiere un ID de informe para descargar el PDF.");
  }
  
  try {
    const response = await api.get(`/report/pdf/${reportId}`, {
      responseType: "blob", 
    });
    
    handlePdfDownload(response);
    
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message;
    console.error(`Error al descargar el PDF para el informe ${reportId}:`, errorMsg);
    throw new Error(errorMsg);
  }
};

// // Interceptor para peticiones - configurar headers dinámicamente
// api.interceptors.request.use(
//   (config) => {
//     console.log('🔄 API Request:', {
//       method: config.method,
//       url: config.url,
//       baseURL: config.baseURL,
//       headers: config.headers,
//       data: config.data instanceof FormData ? 'FormData' : config.data
//     });
    
//     // No configurar Content-Type para FormData, dejamos que axios lo maneje
//     if (!(config.data instanceof FormData)) {
//       config.headers['Content-Type'] = 'application/json';
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('🔴 Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// // Interceptor para respuestas
// api.interceptors.response.use(
//   (response) => {
//     console.log('✅ API Response:', {
//       status: response.status,
//       statusText: response.statusText,
//       data: response.data,
//       headers: response.headers
//     });
//     return response;
//   },
//   (error) => {
//     console.error('🔴 API Response Error:', {
//       message: error.message,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data,
//       headers: error.response?.headers,
//       config: {
//         method: error.config?.method,
//         url: error.config?.url,
//         baseURL: error.config?.baseURL
//       }
//     });
//     return Promise.reject(error);
//   }
// );

// export default api;
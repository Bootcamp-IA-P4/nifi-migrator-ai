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
    const response = await api.get("/flows");
    return response.data.files; 
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message;
    console.error("Error en getAllFlows:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * 4. SERVICIO PARA SUBIR UN TEMPLATE (REGISTRY)
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


// Servicio para obtener la lista de informes desde Supabase

export const getAllReports = async () => {
  try {
    const response = await api.get("/reports");
    return response.data.reports || []; 
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message;
    console.error("Error en getAllReports:", errorMsg);
    throw new Error(errorMsg);
  }
};


// Servicio para auditar un informe guardado

export const auditStoredReport = async (reportId) => {
  try {
    const response = await api.post("/audit/stored", { report_id: reportId });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message;
    console.error("Error en auditStoredReport:", errorMsg);
    throw new Error(errorMsg);
  }
};
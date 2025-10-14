// // src/components/UploadForm.jsx
import React, { useState, useCallback } from "react";
import { analyzeFlow } from "../services/api";
import { Upload, FileText } from "lucide-react"; 

function UploadForm({ onReport, onFileSelect }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");
  const [generatePdf, setGeneratePdf] = useState(false);
  
  const handleFileChange = useCallback((selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect(selectedFile); 
      setError(null);
    }
  }, [onFileSelect]);

  // 🔹 Drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]); 
    }
  }, [handleFileChange]); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("⚠️ Por favor, selecciona un archivo.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage("🔍 Analizando flujo... Esto puede tardar unos minutos.");

    try {
      const reportData = await analyzeFlow(file, false); 
      
      onReport(reportData); 
      setMessage("✅ Análisis completado con éxito.");
    } catch (err) {
      setError(`❌ Error en el análisis: ${err.message}`);
      onReport(null);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onDragEnter={handleDrag}
      className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 relative"
    >
      {/* Drag & Drop area */}
      <label
        className={`w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 
          ${
            dragActive
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/30"
              : "border-gray-300 bg-gray-50 dark:bg-[#1e293b] hover:border-blue-400 hover:bg-blue-50/30"
          }`}
      >
        <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
        <p className="text-gray-700 dark:text-gray-200 font-medium">
          {file ? file.name : "Drag & Drop your XML file here"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          or click to select a file
        </p>
        <input
          type="file"
          accept=".xml"
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
        />
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-300 
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-[1.03] hover:shadow-lg"
          }`}
      >
        {loading ? "Processing..." : "Analyze & Save"}
      </button>

      {/* Message and error feedback */}
      {message && (
        <p className="text-sm text-blue-600 dark:text-blue-400">{message}</p>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Overlay for drag */}
      {dragActive && (
        <div
          className="absolute inset-0 z-50"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
}

export default UploadForm;

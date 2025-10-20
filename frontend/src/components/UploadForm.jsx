// import React, { useState, useCallback } from "react";
// import { analyzeFlow } from "../services/api";

// function UploadForm({ onReport, onFileSelect }) {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dragActive, setDragActive] = useState(false);
//   const [message, setMessage] = useState("");
//   const [progress, setProgress] = useState(0);

//   const handleFileChange = useCallback(
//     (selectedFile) => {
//       if (selectedFile) {
//         setFile(selectedFile);
//         onFileSelect(selectedFile);
//         setError(null);
//         setMessage("");
//       }
//     },
//     [onFileSelect]
//   );

//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (["dragenter", "dragover"].includes(e.type)) {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   }, []);

//   const handleDrop = useCallback(
//     (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setDragActive(false);
//       if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//         handleFileChange(e.dataTransfer.files[0]);
//       }
//     },
//     [handleFileChange]
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Por favor, selecciona un archivo XML.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setMessage("Analizando flujo... esto puede tardar unos minutos.");
//     setProgress(10);

//     try {
//       // Simula el progreso mientras analiza
//       const fakeProgress = setInterval(() => {
//         setProgress((prev) => (prev < 90 ? prev + 5 : prev));
//       }, 300);

//       const reportData = await analyzeFlow(file, false);
//       clearInterval(fakeProgress);
//       setProgress(100);

//       onReport(reportData);
//       setMessage("Análisis completado con éxito.");
//     } catch (err) {
//       setError(`Error en el análisis: ${err.message}`);
//       onReport(null);
//       setMessage("");
//     } finally {
//       setTimeout(() => setProgress(0), 1000);
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       onDragEnter={handleDrag}
//       className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 relative"
//     >
//       {/* Área Drag & Drop */}
//       <label
//         className={`relative w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 text-center overflow-hidden
//           ${
//             dragActive
//               ? "border-blue-500 bg-blue-50/40 dark:bg-blue-900/20"
//               : "border-gray-300 bg-gray-50 dark:bg-[#1e293b] hover:border-blue-400 hover:bg-blue-50/20"
//           }`}
//       >
//         {/* ✨ Efecto Glow Animado */}
//         {dragActive && (
//           <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/50 animate-pulse-glow pointer-events-none"></div>
//         )}

//         {/* SVG minimalista */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className={`w-12 h-12 mb-3 transition-all duration-300 ${
//             dragActive
//               ? "stroke-blue-600 dark:stroke-blue-400 scale-110"
//               : "stroke-gray-500 dark:stroke-gray-400"
//           }`}
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.8}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M12 16V4m0 0l4 4m-4-4L8 8m8 4h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2h4"
//           />
//         </svg>

//         <p className="text-base font-medium text-gray-800 dark:text-gray-100 mb-2">
//           {file ? file.name : "Arrastra tus archivos aquí"}
//         </p>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           o haz clic para seleccionarlo
//         </p>

//         <input
//           type="file"
//           accept=".xml"
//           onChange={(e) => handleFileChange(e.target.files[0])}
//           className="hidden"
//         />
//       </label>

//       {/* Barra de progreso */}
//       {loading && (
//         <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mt-2">
//           <div
//             className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700 transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}

//       {/* Botón de envío */}
//       <button
//         type="submit"
//         disabled={loading}
//         className={`w-full py-3 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-300
//           ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-[1.02] hover:shadow-md"
//           }`}
//       >
//         {loading ? "Procesando..." : "Analizar y Generar Reporte"}
//       </button>

//       {/* Mensajes */}
//       {message && (
//         <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
//           {message}
//         </p>
//       )}
//       {error && (
//         <p className="text-sm text-red-600 dark:text-red-400 text-center">
//           {error}
//         </p>
//       )}

//       {/* Overlay para Drag */}
//       {dragActive && (
//         <div
//           className="absolute inset-0 z-50"
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         ></div>
//       )}

//       {/* 🔥 Animación personalizada */}
//       <style jsx="true">{`
//         @keyframes pulse-glow {
//           0% {
//             box-shadow: 0 0 10px rgba(59, 130, 246, 0.3),
//               0 0 20px rgba(59, 130, 246, 0.2),
//               0 0 30px rgba(59, 130, 246, 0.1);
//           }
//           50% {
//             box-shadow: 0 0 25px rgba(59, 130, 246, 0.6),
//               0 0 40px rgba(59, 130, 246, 0.3),
//               0 0 60px rgba(59, 130, 246, 0.2);
//           }
//           100% {
//             box-shadow: 0 0 10px rgba(59, 130, 246, 0.3),
//               0 0 20px rgba(59, 130, 246, 0.2),
//               0 0 30px rgba(59, 130, 246, 0.1);
//           }
//         }

//         .animate-pulse-glow {
//           animation: pulse-glow 1.8s ease-in-out infinite;
//         }
//       `}</style>
//     </form>
//   );
// }

// export default UploadForm;
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { analyzeFlow } from "../services/api";

function UploadForm({ onReport, onFileSelect }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = useCallback(
    (selectedFile) => {
      if (selectedFile) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
        setError(null);
        setMessage("");
      }
    },
    [onFileSelect]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError(t("uploadForm.noFile"));
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(t("uploadForm.analyzing"));
    setProgress(10);

    try {
      // Simula el progreso mientras analiza
      const fakeProgress = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 300);

      const reportData = await analyzeFlow(file, false);
      clearInterval(fakeProgress);
      setProgress(100);

      onReport(reportData);
      setMessage(t("uploadForm.completed"));
    } catch (err) {
      setError(`${t("uploadForm.error")} ${err.message}`);
      onReport(null);
      setMessage("");
    } finally {
      setTimeout(() => setProgress(0), 1000);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onDragEnter={handleDrag}
      className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 relative"
    >
      {/* Área Drag & Drop */}
      <label
        className={`relative w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 text-center overflow-hidden
          ${
            dragActive
              ? "border-blue-500 bg-blue-50/40 dark:bg-blue-900/20"
              : "border-gray-300 bg-gray-50 dark:bg-[#1e293b] hover:border-blue-400 hover:bg-blue-50/20"
          }`}
      >
        {/* ✨ Efecto Glow Animado */}
        {dragActive && (
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/50 animate-pulse-glow pointer-events-none"></div>
        )}

        {/* SVG minimalista */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-12 h-12 mb-3 transition-all duration-300 ${
            dragActive
              ? "stroke-blue-600 dark:stroke-blue-400 scale-110"
              : "stroke-gray-500 dark:stroke-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16V4m0 0l4 4m-4-4L8 8m8 4h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2h4"
          />
        </svg>

        <p className="text-base font-medium text-gray-800 dark:text-gray-100 mb-2">
          {file ? file.name : t("uploadForm.dragAndDrop")}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("uploadForm.orClick")}
        </p>

        <input
          type="file"
          accept=".xml"
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
        />
      </label>

      {/* Barra de progreso */}
      {loading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mt-2">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-300
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-[1.02] hover:shadow-md"
          }`}
      >
        {loading ? t("uploadForm.processing") : t("uploadForm.analyzeAndSave")}
      </button>

      {/* Mensajes */}
      {message && (
        <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </p>
      )}

      {/* Overlay para Drag */}
      {dragActive && (
        <div
          className="absolute inset-0 z-50"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}

      {/* 🔥 Animación personalizada */}
      <style jsx="true">{`
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3),
              0 0 20px rgba(59, 130, 246, 0.2),
              0 0 30px rgba(59, 130, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.6),
              0 0 40px rgba(59, 130, 246, 0.3),
              0 0 60px rgba(59, 130, 246, 0.2);
          }
          100% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3),
              0 0 20px rgba(59, 130, 246, 0.2),
              0 0 30px rgba(59, 130, 246, 0.1);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 1.8s ease-in-out infinite;
        }
      `}</style>
    </form>
  );
}

export default UploadForm;

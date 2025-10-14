// // export default Upload;
// import React, { useState } from "react";
// import UploadForm from "../components/UploadForm";
// import ReportView from "../components/ReportView";
// import mockReport from "../data/mockReport";

// const Upload = () => {
//   const [report, setReport] = useState(mockReport);

//   const handleDownload = () => {
//     if (!report) return;
//     const element = document.createElement("a");
//     const file = new Blob([JSON.stringify(report, null, 2)], {
//       type: "application/json",
//     });
//     element.href = URL.createObjectURL(file);
//     element.download = "nifi_migration_report.json";
//     document.body.appendChild(element);
//     element.click();
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f172a] overflow-hidden font-inter transition-colors duration-500">
//       {/* 🌌 HERO / BANNER SUPERIOR */}
//       <section className="relative overflow-hidden text-white py-20 flex flex-col items-center justify-center">
//         {/* Fondo degradado animado */}
//         <div className="absolute inset-0 bg-gradient-to-r from-[#2663EB] via-[#3C7BFA] to-[#6CA8FF] dark:from-[#0b173d] dark:via-[#1a2b6d] dark:to-[#2663EB] animate-gradient-x"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)]"></div>

//         {/* Contenido principal */}
//         <div className="relative z-10 max-w-5xl text-center px-6">
//           {/* Ícono cohete */}
//           <div className="flex justify-center mb-6">
//             <div className="bg-white/10 rounded-full p-5 shadow-lg backdrop-blur-md hover:scale-110 transition-all duration-300">
//               <span className="text-5xl drop-shadow-md">🚀</span>
//             </div>
//           </div>

//           <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
//             Migrador NiFi <span className="text-white/90">1.x → 2.x</span>
//           </h1>

//           <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 leading-relaxed max-w-3xl mx-auto mb-10">
//             Sube tu archivo XML exportado desde NiFi 1.x y obtén un informe
//             detallado con el mapeo de propiedades, procesadores y recomendaciones
//             para migrar fácilmente a NiFi 2.x.
//           </p>

//           <button
//             onClick={() =>
//               window.open("https://nifi.apache.org/docs.html", "_blank")
//             }
//             className="px-8 py-3 bg-white/20 border border-white/30 rounded-xl 
//                        text-white font-semibold shadow-lg backdrop-blur-md 
//                        hover:bg-white/30 hover:shadow-xl hover:scale-[1.05] 
//                        transition-all duration-300 flex items-center gap-2 mx-auto"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//             Ver documentación
//           </button>
//         </div>
//       </section>

//       {/* 🔸 CONTENIDO PRINCIPAL */}
//       <section className="flex flex-col md:flex-row flex-grow overflow-hidden">
//         {/* PANEL IZQUIERDO */}
//         <div className="md:w-1/2 w-full bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-gray-700 flex flex-col px-8 py-10 shadow-inner overflow-y-auto transition-colors duration-500">
//           <div className="max-w-md mx-auto w-full">
//             <h2 className="text-2xl font-bold text-[#2663EB] dark:text-[#6CA8FF] mb-4">
//               📂 Subir archivo XML
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
//               Carga tu flujo exportado desde NiFi 1.x para generar un informe
//               automático de migración.
//             </p>

//             {/* Upload Box */}
//             <div className="group relative flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-600 bg-gradient-to-b from-white to-blue-50/20 dark:from-[#1e293b] dark:to-[#0f172a] hover:border-blue-500 hover:shadow-lg transition-all duration-300 mb-8">
//               <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-[#1e3a8a]/30 text-[#2663EB] dark:text-[#6CA8FF] mb-4 group-hover:bg-blue-100 dark:group-hover:bg-[#1e40af]/50 transition-all">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-8 w-8"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
//                 Selecciona o arrastra tu archivo XML
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 text-center max-w-sm">
//                 Tamaño máximo permitido: <strong>5 MB</strong>
//               </p>
//               <UploadForm onReport={setReport} />
//             </div>

//             {/* Instrucciones */}
//             <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-blue-50/40 dark:bg-[#1e3a8a]/20 p-4 rounded-xl border border-blue-100 dark:border-blue-700 shadow-sm">
//               <h3 className="font-semibold text-[#2663EB] dark:text-[#6CA8FF] mb-2">
//                 📋 Instrucciones
//               </h3>
//               <ul className="list-decimal list-inside space-y-2">
//                 <li>
//                   El archivo debe ser un <strong>.xml</strong> exportado desde NiFi 1.x.
//                 </li>
//                 <li>
//                   Tamaño máximo: <strong>5 MB</strong>.
//                 </li>
//                 <li>
//                   Presiona <strong>“Subir archivo”</strong> o arrástralo en el recuadro.
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* PANEL DERECHO */}
//         <div className="md:w-1/2 w-full bg-gray-100 dark:bg-[#0f172a] flex flex-col overflow-hidden transition-colors duration-500">
//           {/* Header */}
//           <div className="px-6 py-4 border-b bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm flex items-center justify-between shadow-sm sticky top-0 z-10">
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
//               {report ? "📑 Informe Generado" : "🕐 Esperando análisis"}
//             </h2>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setReport(mockReport)}
//                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#2663EB] to-[#3C7BFA] rounded-lg shadow-md hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="w-4 h-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M4 20v-5h.581m15.357-2A8.003 8.003 0 014.582 15"
//                   />
//                 </svg>
//                 <span>Actualizar Informe</span>
//               </button>

//               {report && (
//                 <button
//                   onClick={handleDownload}
//                   className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2663EB] dark:text-[#6CA8FF] bg-white dark:bg-[#1e293b] border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.04] hover:bg-blue-50 dark:hover:bg-[#1e3a8a]/40 transition-all duration-300"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="w-4 h-4"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
//                     />
//                   </svg>
//                   <span>Descargar JSON</span>
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Contenido scrollable */}
//           <div className="flex-grow overflow-y-auto px-6 py-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-500">
//             {!report ? (
//               <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
//                 <p className="text-lg mb-2 font-medium">
//                   Aún no hay informe generado.
//                 </p>
//                 <p className="text-sm">
//                   Sube un archivo XML en el panel izquierdo para comenzar.
//                 </p>
//               </div>
//             ) : (
//               <div className="bg-white dark:bg-[#1e293b] shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent pr-2">
//                 <ReportView report={report} />
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Upload;

import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import ReportView from "../components/ReportView";
import mockReport from "../data/mockReport";
import { analyzeFlow, uploadTemplate } from "../services/api";

const Upload = () => {
  const [report, setReport] = useState(mockReport);
  const [selectedFile, setSelectedFile] = useState(null); 
  
  const handleNewReport = (newReport) => {
    setReport(newReport);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };


  const handleDownload = () => {
    if (!report) return;
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "nifi_migration_report.json";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f172a] overflow-hidden font-inter transition-colors duration-500">
      {/* 🌌 HERO / BANNER FIJO CON COLORES OSCUROS */}
      <section className="relative overflow-hidden text-white py-20 flex flex-col items-center justify-center">
        {/* Fondo degradado (siempre oscuro y elegante) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b173d] via-[#1a2b6d] to-[#2663EB] animate-gradient-x"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.08),transparent_70%)]"></div>

        {/* Contenido principal */}
        <div className="relative z-10 max-w-5xl text-center px-6">
          {/* Ícono */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 rounded-full p-5 shadow-lg backdrop-blur-md hover:scale-110 transition-all duration-300">
              <span className="text-5xl drop-shadow-md">🚀</span>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
            Migrador NiFi <span className="text-white/90">1.x → 2.x</span>
          </h1>

          {/* Descripción */}
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-10">
            Sube tu archivo XML exportado desde NiFi 1.x y obtén un informe
            detallado con el mapeo de propiedades, procesadores y recomendaciones
            para migrar fácilmente a NiFi 2.x.
          </p>

          {/* CTA */}
          <button
            onClick={() =>
              window.open("https://nifi.apache.org/docs.html", "_blank")
            }
            className="px-8 py-3 bg-white/20 border border-white/30 rounded-xl 
                       text-white font-semibold shadow-lg backdrop-blur-md 
                       hover:bg-white/30 hover:shadow-xl hover:scale-[1.05] 
                       transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ver documentación
          </button>
        </div>
      </section>

      {/* 🔸 CONTENIDO PRINCIPAL */}
      <section className="flex flex-col md:flex-row flex-grow overflow-hidden">
        {/* PANEL IZQUIERDO */}
        <div className="md:w-1/2 w-full bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-gray-700 flex flex-col px-8 py-10 shadow-inner overflow-y-auto transition-colors duration-500">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold text-[#2663EB] dark:text-[#6CA8FF] mb-4">
              📂 Subir archivo XML
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
              Carga tu flujo exportado desde NiFi 1.x para generar un informe
              automático de migración.
            </p>

            {/* Upload Box */}
            <div className="group relative flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-600 bg-gradient-to-b from-white to-blue-50/20 dark:from-[#1e293b] dark:to-[#0f172a] hover:border-blue-500 hover:shadow-lg transition-all duration-300 mb-8">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-[#1e3a8a]/30 text-[#2663EB] dark:text-[#6CA8FF] mb-4 group-hover:bg-blue-100 dark:group-hover:bg-[#1e40af]/50 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Selecciona o arrastra tu archivo XML
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 text-center max-w-sm">
                Tamaño máximo permitido: <strong>5 MB</strong>
              </p>
              <UploadForm onReport={handleNewReport} onFileSelect={handleFileSelect} />
            </div>

            {/* Instrucciones */}
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-blue-50/40 dark:bg-[#1e3a8a]/20 p-4 rounded-xl border border-blue-100 dark:border-blue-700 shadow-sm">
              <h3 className="font-semibold text-[#2663EB] dark:text-[#6CA8FF] mb-2">
                📋 Instrucciones
              </h3>
              <ul className="list-decimal list-inside space-y-2">
                <li>
                  El archivo debe ser un <strong>.xml</strong> exportado desde NiFi 1.x.
                </li>
                <li>
                  Tamaño máximo: <strong>5 MB</strong>.
                </li>
                <li>
                  Presiona <strong>“Subir archivo”</strong> o arrástralo en el recuadro.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="md:w-1/2 w-full bg-gray-100 dark:bg-[#0f172a] flex flex-col overflow-hidden transition-colors duration-500">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm flex items-center justify-between shadow-sm sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              {report ? "📑 Informe Generado" : "🕐 Esperando análisis"}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setReport(mockReport)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#2663EB] to-[#3C7BFA] rounded-lg shadow-md hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M4 20v-5h.581m15.357-2A8.003 8.003 0 014.582 15"
                  />
                </svg>
                <span>Actualizar Informe</span>
              </button>

              {report && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2663EB] dark:text-[#6CA8FF] bg-white dark:bg-[#1e293b] border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.04] hover:bg-blue-50 dark:hover:bg-[#1e3a8a]/40 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                  <span>Descargar JSON</span>
                </button>
              )}
            </div>
          </div>

          {/* Reporte */}
          <div className="flex-grow overflow-y-auto px-6 py-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-500">
            {!report ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-2 font-medium">
                  Aún no hay informe generado.
                </p>
                <p className="text-sm">
                  Sube un archivo XML en el panel izquierdo para comenzar.
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1e293b] shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent pr-2">
                <ReportView report={report} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upload;




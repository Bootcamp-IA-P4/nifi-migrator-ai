// import React, { useEffect, useState } from "react";
// import { FileText, Trash2, Clock } from "lucide-react";

// const Report = () => {
//   const [reports, setReports] = useState([]);

//   // 🔹 Cargar historial desde localStorage
//   useEffect(() => {
//     try {
//       const stored = JSON.parse(localStorage.getItem("reportHistory") || "[]");
//       setReports(stored);
//     } catch (error) {
//       console.error("Error al cargar historial de informes:", error);
//     }
//   }, []);

//   // 🔹 Eliminar informe del historial
//   const handleDelete = (id) => {
//     const updated = reports.filter((r) => r.id !== id);
//     setReports(updated);
//     localStorage.setItem("reportHistory", JSON.stringify(updated));
//   };

//   // 🔹 Ver detalle (por ahora solo muestra en consola y alerta)
//   const handleView = (report) => {
//     console.log("🧩 Report data:", report.data);
//     alert(`🗂️ Abriendo informe: ${report.name}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-10 font-inter transition-colors duration-500">
//       <div className="max-w-5xl mx-auto">
//         {/* Título */}
//         <h1 className="text-3xl font-bold text-[#2663EB] dark:text-[#6CA8FF] mb-10 text-center">
//           📜 Historial de Informes Generados
//         </h1>

//         {/* Si no hay informes */}
//         {reports.length === 0 ? (
//           <div className="text-center text-gray-500 dark:text-gray-400">
//             <p>No hay informes guardados aún.</p>
//             <p className="text-sm mt-2">
//               Genera un informe en la página principal para verlo aquí.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {reports.map((report) => (
//               <div
//                 key={report.id}
//                 className="flex items-center justify-between bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
//               >
//                 {/* Info principal */}
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-blue-100 dark:bg-[#1e40af]/40 rounded-full">
//                     <FileText className="w-6 h-6 text-[#2663EB] dark:text-[#6CA8FF]" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-800 dark:text-gray-100">
//                       {report.name}
//                     </p>
//                     <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
//                       <Clock className="w-4 h-4" />
//                       {new Date(report.date).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Botones de acción */}
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => handleView(report)}
//                     className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#2663EB] to-[#3C7BFA] rounded-lg shadow hover:scale-[1.03] transition-all"
//                   >
//                     Ver
//                   </button>
//                   <button
//                     onClick={() => handleDelete(report.id)}
//                     className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow flex items-center gap-1 transition-all"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Borrar
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Report;
import React, { useEffect, useState } from "react";
import { FileText, Trash2, Clock, X } from "lucide-react";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // 👀 Para el modal

  // 🔹 Cargar historial desde localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("reportHistory") || "[]");
      setReports(stored);
    } catch (error) {
      console.error("Error al cargar historial de informes:", error);
    }
  }, []);

  // 🔹 Eliminar informe del historial
  const handleDelete = (id) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("reportHistory", JSON.stringify(updated));
  };

  // 🔹 Ver detalle (abre modal)
  const handleView = (report) => {
    setSelectedReport(report);
  };

  // 🔹 Cerrar modal
  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-10 font-inter transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        {/* 🏷️ Título e introducción */}
        <h1 className="text-4xl font-extrabold text-[#2663EB] dark:text-[#6CA8FF] mb-4 text-center">
          📜 Historial de Informes Generados
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
          Aquí encontrarás todos los informes que has generado recientemente con
          el orquestador. Puedes revisar el contenido de cada uno, descargarlo o
          eliminarlo del historial local cuando ya no lo necesites.
        </p>

        {/* Si no hay informes */}
        {reports.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No hay informes guardados aún.</p>
            <p className="text-sm mt-2">
              Genera un informe en la página principal para verlo aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                {/* Info principal */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-[#1e40af]/40 rounded-full">
                    <FileText className="w-6 h-6 text-[#2663EB] dark:text-[#6CA8FF]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {report.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="w-4 h-4" />
                      {new Date(report.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleView(report)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#2663EB] to-[#3C7BFA] rounded-lg shadow hover:scale-[1.03] transition-all"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Modal para ver detalle del informe */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-xl max-w-3xl w-full mx-4 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#2663EB] dark:text-[#6CA8FF] mb-4">
              🧾 {selectedReport.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Generado el {new Date(selectedReport.date).toLocaleString()}
            </p>

            <div className="bg-gray-100 dark:bg-[#0f172a] p-4 rounded-lg text-gray-800 dark:text-gray-200 overflow-y-auto max-h-[60vh]">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {selectedReport.data || "Sin contenido disponible."}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;

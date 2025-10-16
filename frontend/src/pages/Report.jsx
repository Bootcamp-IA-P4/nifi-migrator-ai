import React, { useEffect, useState } from "react";
import { FileText, Clock, ShieldCheck, Loader2, ChevronDown, Trash2, X } from "lucide-react";
import { getAllReports, auditStoredReport } from "../services/api";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [audits, setAudits] = useState({}); 
  const [auditingId, setAuditingId] = useState(null); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const reportList = await getAllReports();
        setReports(reportList);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleAudit = async (reportId) => {
    setAuditingId(reportId);
    try {
      const auditResult = await auditStoredReport(reportId);
      setAudits(prev => ({ ...prev, [reportId]: { ...auditResult, isOpen: true } }));
    } catch (err) {
      setAudits(prev => ({ ...prev, [reportId]: { error: err.message, isOpen: true } }));
    } finally {
      setAuditingId(null);
    }
  };
  
  const toggleAuditView = (reportId) => {
    setAudits(prev => ({
      ...prev,
      [reportId]: { ...prev[reportId], isOpen: !prev[reportId]?.isOpen }
    }));
  };

  if (loading) {
    return <div className="text-center p-10">Cargando informes...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }
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
          el orquestador. Puedes revisar el contenido de cada uno, auditarlo, descargarlo o
          eliminarlo del historial local cuando ya no lo necesites.
        </p>

        {reports.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No hay informes guardados aún.</p>
            <p className="text-sm mt-2">
              Genera un informe en la página principal para verlo aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const audit = audits[report.name];
              const isAuditing = auditingId === report.name;
              return (
                <div key={report.id} className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-[#1e40af]/40 rounded-full">
                        <FileText className="w-6 h-6 text-[#2663EB] dark:text-[#6CA8FF]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{report.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <Clock className="w-4 h-4" />
                          {new Date(report.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleView(report)} className="flex items-center justify-center w-28 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-all">Ver</button>
                      <button onClick={() => handleAudit(report.name)} disabled={isAuditing} className="flex items-center justify-center w-28 gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400">
                        {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        {isAuditing ? "Auditando..." : "Auditar"}
                      </button>
                      <button onClick={() => handleDelete(report.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"><Trash2 className="w-5 h-5" /></button>
                      {audit && <button onClick={() => toggleAuditView(report.name)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronDown className={`w-5 h-5 transition-transform ${audit.isOpen ? 'rotate-180' : ''}`} /></button>}
                    </div>
                  </div>
                  {audit?.isOpen && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">Resultado de la Auditoría</h3>
                      {audit.error ? <p className="text-red-500">{audit.error}</p> : (
                        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                          <div><strong className="text-gray-900 dark:text-white">Veredicto Final:</strong><span className={`ml-2 font-semibold ${audit.final_verdict === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>{audit.final_verdict}</span></div>
                          <p><strong className="text-gray-900 dark:text-white">Resumen:</strong> {audit.overall_summary}</p>
                          <div><strong className="text-gray-900 dark:text-white">Puntos Positivos:</strong><ul className="list-disc list-inside mt-1 space-y-1">{audit.positive_points.map((point, i) => <li key={i}>{point}</li>)}</ul></div>
                          <div><strong className="text-gray-900 dark:text-white">Puntos a Mejorar:</strong><ul className="list-disc list-inside mt-1 space-y-1">{audit.points_for_improvement.map((point, i) => <li key={i}>{point}</li>)}</ul></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-xl max-w-3xl w-full mx-4 relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-[#2663EB] dark:text-[#6CA8FF] mb-4">🧾 {selectedReport.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Generado el {new Date(selectedReport.created_at).toLocaleString()}</p>
            <div className="bg-gray-100 dark:bg-[#0f172a] p-4 rounded-lg text-gray-800 dark:text-gray-200 overflow-y-auto max-h-[60vh]">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{selectedReport.data || "El contenido del informe se cargará aquí."}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



//       {/* 🔹 Modal para ver detalle del informe */}
//       {selectedReport && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-xl max-w-3xl w-full mx-4 relative">
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             <h2 className="text-2xl font-bold text-[#2663EB] dark:text-[#6CA8FF] mb-4">
//               🧾 {selectedReport.name}
//             </h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
//               Generado el {new Date(selectedReport.date).toLocaleString()}
//             </p>

//             <div className="bg-gray-100 dark:bg-[#0f172a] p-4 rounded-lg text-gray-800 dark:text-gray-200 overflow-y-auto max-h-[60vh]">
//               <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
//                 {selectedReport.data || "Sin contenido disponible."}
//               </pre>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

export default Report;

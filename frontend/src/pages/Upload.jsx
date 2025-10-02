// src/pages/Upload.jsx
import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import ReportView from "../components/ReportView";
import mockReport from "../data/mockReport"; // 👈 Import del mock

const Upload = () => {
  // Usa mockReport para probar. Cámbialo a null para usar solo backend.
  const [report, setReport] = useState(mockReport);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🚀 Subir Flujos NiFi 1.x → 2.x
          </h1>
          <p className="text-lg text-indigo-100 leading-relaxed">
            Sube tu archivo XML de NiFi 1.x y nuestro sistema generará un 
            informe detallado con el mapeo de propiedades y recomendaciones 
            para migrar fácilmente a NiFi 2.x.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📋 Instrucciones
          </h2>
          <ul className="list-decimal list-inside text-gray-700 space-y-2 text-base leading-relaxed">
            <li>Selecciona o arrastra un archivo <strong>.xml</strong> exportado desde NiFi 1.x.</li>
            <li>Asegúrate de que el archivo no supere los <strong>5 MB</strong>.</li>
            <li>Haz clic en <strong>Subir archivo</strong> y espera que se genere el informe.</li>
            <li>Revisa el historial de tus últimas subidas al final de la página.</li>
          </ul>
        </div>
      </section>

      <section className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <UploadForm onReport={setReport} />

        {report && (
          <div className="mt-10 bg-white shadow-md rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                📑 Informe Generado
              </h2>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all text-sm"
              >
                ⬇️ Descargar JSON
              </button>
            </div>

            <ReportView report={report} />
          </div>
        )}
      </section>

      <section className="bg-indigo-50 py-10 border-t border-indigo-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">
            💡 Consejos para mejores resultados
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Para garantizar que la migración sea correcta, revisa que tu flujo 
            exportado incluya todos los procesadores necesarios y evita 
            configuraciones personalizadas no soportadas. 
            Si encuentras errores, vuelve a exportar el flujo desde NiFi.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Upload;

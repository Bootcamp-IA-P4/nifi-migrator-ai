import React from "react";
import { FileText, CheckCircle, AlertTriangle, Database } from "lucide-react";
import MermaidChart from "./MermaidChart";

const ReportView = ({ report }) => {
  if (!report) return null;

  // --- Helpers seguros ---
  const safeArray = (val) => (Array.isArray(val) ? val : []);
  const safeText = (val) =>
    typeof val === "string" && val.trim() !== "" ? val : null;

  const renderSection = (title, icon, content) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
        {icon}
        {title}
      </h3>
      <div className="space-y-3">{content}</div>
    </div>
  );

  const renderList = (items, color, Icon) => (
    <ul className="space-y-2">
      {items.map((item, idx) => {
        let content = "";
        if (typeof item === "object" && item !== null) {
          if (item.name && item.type) {
            content = `${item.name} (${item.type})`;
          } else {
            content = JSON.stringify(item);
          }
        } else {
          content = String(item);
        }

        return (
          <li
            key={idx}
            className={`flex items-start gap-2 p-3 rounded-lg border ${color.bg}`}
          >
            <Icon className={`w-5 h-5 ${color.icon} mt-0.5`} />
            <span className="text-sm text-gray-700">{content}</span>
          </li>
        );
      })}
    </ul>
  );

  // --- Datos principales ---
  const resumen = safeText(report?.structured?.resumen_ejecutivo);
  const componentes = safeArray(report?.structured?.analisis_componentes);
  const recomendaciones = safeArray(report?.structured?.recomendaciones);
  const puntosCriticos = safeArray(report?.structured?.puntos_criticos);

  // --- Extraer diagramas Mermaid ---
  let diagramas = [];

  // 1) Si structured trae algo (opcional)
  if (report?.structured?.diagrama_flujo) {
    diagramas.push(report.structured.diagrama_flujo.toString().trim());
  }

  // 2) Buscar en raw_markdown
  if (report?.raw_markdown) {
    const markdownText = Array.isArray(report.raw_markdown)
      ? report.raw_markdown.join("\n")
      : String(report.raw_markdown);

    console.log("📜 raw_markdown recibido:", markdownText);

    // Captura todos los bloques ```mermaid ... ```
    const matches = [...markdownText.matchAll(/```mermaid([\s\S]*?)```/g)];
    diagramas = matches.map((m) => m[1].trim());
  }

  console.log("📊 Diagramas extraídos:", diagramas);

  const hasStructured =
    resumen ||
    componentes.length ||
    recomendaciones.length ||
    puntosCriticos.length ||
    diagramas.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FileText className="text-indigo-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-900">📑 Informe Generado</h2>
      </div>

      {resumen &&
        renderSection(
          "Resumen Ejecutivo",
          <FileText className="text-blue-600 w-5 h-5" />,
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100 leading-relaxed">
            {resumen}
          </p>
        )}

      {componentes.length > 0 &&
        renderSection(
          "Análisis de Componentes",
          <Database className="text-indigo-600 w-5 h-5" />,
          renderList(
            componentes,
            { bg: "bg-gray-50 border-gray-200", icon: "text-indigo-600" },
            Database
          )
        )}

      {puntosCriticos.length > 0 &&
        renderSection(
          "Puntos Críticos",
          <AlertTriangle className="text-red-600 w-5 h-5" />,
          renderList(
            puntosCriticos,
            { bg: "bg-red-50 border-red-200", icon: "text-red-600" },
            AlertTriangle
          )
        )}

      {recomendaciones.length > 0 &&
        renderSection(
          "Recomendaciones",
          <CheckCircle className="text-green-600 w-5 h-5" />,
          renderList(
            recomendaciones,
            { bg: "bg-green-50 border-green-200", icon: "text-green-600" },
            CheckCircle
          )
        )}

      {diagramas.length > 0 &&
        renderSection(
          "Diagramas de Flujo",
          <FileText className="text-purple-600 w-5 h-5" />,
          <div className="space-y-6">
            {diagramas.map((d, i) => (
              <div
                key={i}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto"
              >
                <MermaidChart chart={d} />
              </div>
            ))}
          </div>
        )}

      {!hasStructured && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            📂 Datos del Reporte (JSON crudo)
          </h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ReportView;

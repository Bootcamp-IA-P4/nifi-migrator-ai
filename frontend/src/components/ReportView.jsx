import React from "react";
import { useTranslation } from "react-i18next";
import { FileText, CheckCircle, Database } from "lucide-react";
import MermaidChart from "./MermaidChart";
import { sanitizeMermaid } from "../utils/MermaidSanitizer";

const ReportView = ({ report }) => {
  const { t } = useTranslation();

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {t("uploadPage.noReportTitle")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg">
          {t("uploadPage.noReportDescription")}
        </p>
      </div>
    );
  }

  // Helpers
  const safeArray = (val) => (Array.isArray(val) ? val : []);
  const safeText = (val) =>
    typeof val === "string" && val.trim() !== "" ? val : null;

  const resumen = safeText(report?.structured?.resumen_ejecutivo);
  const componentes = safeArray(report?.structured?.analisis_componentes);
  const recomendaciones = safeArray(report?.structured?.recomendaciones);
  const puntosCriticos = safeArray(report?.structured?.puntos_criticos);

  // Diagramas Mermaid
  let diagramas = [];
  if (report?.structured?.diagrama_flujo) {
    diagramas.push(sanitizeMermaid(report.structured.diagrama_flujo.toString()));
  }
  if (report?.raw_markdown) {
    const markdownText = Array.isArray(report.raw_markdown)
      ? report.raw_markdown.join("\n")
      : String(report.raw_markdown);
    const matches = [...markdownText.matchAll(/```mermaid([\s\S]*?)```/g)];
    diagramas = matches.map((m) => sanitizeMermaid(m[1]));
  }

  const renderList = (items, Icon, color) => (
    <ul className="space-y-3">
      {items.map((item, idx) => {
        let content = "";
        if (typeof item === "object" && item !== null) {
          const statusTranslations = {
            DIRECT_MAPPING: "Equivalencia Directa",
            NEEDS_REVIEW: "Requiere Revisión",
            DEPRECATED: "Obsoleto",
            REPLACEMENT_FOUND: "Reemplazo Encontrado",
          };
          const friendlyStatus = statusTranslations[item.status] || item.status;
          content = `${item.nifi1_name || "—"} | Tipo: ${
            item.nifi1_type || "—"
          } | Estado: ${friendlyStatus}`;
        } else {
          content = String(item);
        }

        return (
          <li key={idx} className="flex items-start gap-3">
            <Icon className={`w-5 h-5 ${color} mt-1 flex-shrink-0`} />
            <span className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              {content}
            </span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-10 py-8">
      {/* HEADER */}
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-[#006fff] mb-2 flex items-center gap-2">
          <FileText className="w-7 h-7 text-[#006fff]" />
          {t("uploadPage.reportGenerated")}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          {t("uploadPage.sectionDescription")}
        </p>
      </header>

      {/* RESUMEN */}
      {resumen && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-[#006fff] mb-4">
            {t("uploadPage.sectionTitle")} — Resumen
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-5xl">
            {resumen}
          </p>
        </section>
      )}

      {/* COMPONENTES */}
      {componentes.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-[#006fff] mb-4">
            {t("uploadPage.sectionTitle")} — Componentes
          </h3>
          <div className="pl-2">{renderList(componentes, Database, "text-[#006fff]")}</div>
        </section>
      )}

      {/* PUNTOS CRÍTICOS */}
      {puntosCriticos.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-[#006fff] mb-4">
            {t("uploadPage.sectionTitle")} — Puntos Críticos
          </h3>
          <div className="pl-2">
            {renderList(puntosCriticos, "text-red-500")}
          </div>
        </section>
      )}

      {/* RECOMENDACIONES */}
      {recomendaciones.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-[#006fff] mb-4">
            {t("uploadPage.sectionTitle")} — Recomendaciones
          </h3>
          <div className="pl-2">
            {renderList(recomendaciones, CheckCircle, "text-green-600")}
          </div>
        </section>
      )}

      {/* DIAGRAMAS */}
      {diagramas.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-[#006fff] mb-4">
            Diagramas de Flujo
          </h3>
          <div className="space-y-8">
            {diagramas.map((d, i) => (
              <div key={i} className="overflow-x-auto">
                <MermaidChart chart={d} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ReportView;

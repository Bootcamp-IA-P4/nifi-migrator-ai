import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import UploadForm from "../components/UploadForm";
import ReportView from "../components/ReportView";
import Toast from "../components/Toast";
import mockReport from "../data/mockReport";
import { downloadPdfByReportId } from "../services/api";

const Upload = () => {
  const { t } = useTranslation();
  const [report, setReport] = useState(mockReport);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "info" }), 4000);
  };

  const handleNewReport = (newReport) => {
    setReport(newReport);
    showToast(t("uploadForm.completed"), "success");
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    showToast(`${t("uploadForm.dragAndDrop")}: ${file.name}`, "info");
  };

  const handleDownload = () => {
    if (!report) return;
    try {
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      });
      element.href = URL.createObjectURL(file);
      element.download = "nifi_migration_report.json";
      document.body.appendChild(element);
      element.click();
      showToast(t("uploadPage.downloadJSON") + " ✅", "success");
    } catch {
      showToast(t("uploadForm.error"), "error");
    }
  };

  const handleDownloadPdf = async () => {
    const reportId = report?.report_filename;
    if (!reportId) {
      showToast(t("uploadPage.noReportDescription"), "error");
      return;
    }
    setIsDownloadingPdf(true);
    try {
      await downloadPdfByReportId(reportId);
      showToast(t("uploadPage.downloadPDF") + " ✅", "success");
    } catch {
      showToast(t("uploadForm.error"), "error");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f172a] font-inter overflow-hidden">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "info" })}
        />
      )}

      {/* HERO */}
      <section className="relative text-white py-24 flex flex-col items-center justify-center overflow-hidden">
        {/* Fondo con azul personalizado */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001b3a] via-[#004cb3] to-[#006fff]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            NiFi Migration <span className="text-[#bcdcff]">Automation</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("uploadPage.description")}
          </p>
          <button
            onClick={() =>
              window.open("https://nifi.apache.org/docs.html", "_blank")
            }
            className="px-8 py-3 bg-white/20 border border-white/30 rounded-lg text-white font-medium backdrop-blur-md hover:bg-white/30 transition-all duration-300"
          >
            {t("uploadPage.ctaDocs")}
          </button>
        </motion.div>
      </section>

      {/* MAIN */}
      <section className="flex flex-col md:flex-row flex-grow overflow-hidden">
        {/* LEFT PANEL */}
        <div className="md:w-1/2 w-full bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-gray-700 flex flex-col px-10 py-14 shadow-inner overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-semibold text-[#006fff] mb-6">
              {t("uploadPage.sectionTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t("uploadPage.sectionDescription")}
            </p>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`relative flex flex-col items-center justify-center w-full p-10 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                selectedFile
                  ? "border-green-400 bg-green-50/30"
                  : "border-[#006fff] hover:border-[#006fff] bg-gradient-to-b from-white to-blue-50/30 dark:from-[#1e293b] dark:to-[#0f172a]"
              }`}
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                {selectedFile
                  ? t("uploadForm.completed")
                  : t("uploadForm.dragAndDrop")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                {t("uploadForm.maxSize")}
              </p>
              <UploadForm
                onReport={handleNewReport}
                onFileSelect={handleFileSelect}
              />
            </motion.div>

            <div className="mt-8 p-5 rounded-xl bg-blue-50/50 dark:bg-[#1e3a8a]/20 border border-blue-100 dark:border-[#006fff]/60">
              <h4 className="font-semibold text-[#006fff] mb-3">
                {t("uploadPage.instructionsTitle")}
              </h4>
              <ul className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                {t("uploadPage.instructions", { returnObjects: true }).map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:w-1/2 w-full bg-gray-100 dark:bg-[#0f172a] flex flex-col overflow-hidden">
          <div className="px-8 py-5 border-b bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm flex items-center justify-between shadow-sm sticky top-0 z-10">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              {report
                ? t("uploadPage.reportGenerated")
                : t("uploadPage.waitingAnalysis")}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setReport(mockReport);
                  showToast(t("uploadPage.updateReport"), "info");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#006fff] hover:bg-[#0056cc] rounded-lg shadow-md hover:scale-105 transition-all"
              >
                {t("uploadPage.updateReport")}
              </button>

              {report && (
                <>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="px-4 py-2 text-sm font-medium text-[#006fff] bg-white dark:bg-[#1e293b] border border-[#006fff]/40 rounded-lg shadow-sm hover:scale-105 transition-all"
                  >
                    {isDownloadingPdf
                      ? t("uploadPage.generating")
                      : t("uploadPage.downloadPDF")}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 text-sm font-medium text-[#006fff] bg-white dark:bg-[#1e293b] border border-[#006fff]/40 rounded-lg shadow-sm hover:scale-105 transition-all"
                  >
                    {t("uploadPage.downloadJSON")}
                  </button>
                </>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-grow overflow-y-auto px-8 py-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#1e293b]"
          >
            {!report ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-2 font-medium">
                  {t("uploadPage.noReportTitle")}
                </p>
                <p className="text-sm">
                  {t("uploadPage.noReportDescription")}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1e293b] shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#006fff]/60 scrollbar-track-transparent">
                <ReportView report={report} />
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Upload;


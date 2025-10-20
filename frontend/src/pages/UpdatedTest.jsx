// src/pages/UploadTest.jsx
import React from "react";
import MermaidChart from "../components/MermaidChart";

const UploadTest = () => {
  const testDiagram = `
    graph TD
      A[Inicio] --> B[Proceso]
      B --> C[Fin Exitoso]
      B --> D[Fin Error]
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">🧪 Test Mermaid</h1>
      <MermaidChart chart={testDiagram} />
    </div>
  );
};

export default UploadTest;

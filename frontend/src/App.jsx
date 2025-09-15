import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import ReportView from "./components/ReportView";

function App() {
  const [report, setReport] = useState(null);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>NiFi Migrator AI</h1>
      <UploadForm onReport={setReport} />
      {report && <ReportView report={report} />}
    </div>
  );
}

export default App;
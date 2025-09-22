import React from "react";

function ReportView({ report }) {
  if (!report) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Analysis Report</h2>
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "1rem",
          borderRadius: "8px",
          overflowX: "auto",
          color: "black"
        }}
      >
        {JSON.stringify(report, null, 2)}
      </pre>
    </div>
  );
}

export default ReportView;

import React, { useState } from "react";
import axios from "axios";

function UploadForm({ onReport }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/v1/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onReport(res.data);
    } catch (err) {
      setError("Error uploading file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "1rem" }}>Upload Analysis File</h2>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f9f9f9"
          }}
        >
          <input
            type="file"
            accept=".xml,.csv,.txt"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
            <p style={{ marginBottom: "1rem" }}>Drag and drop or select file</p>
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              style={{
                padding: "0.5rem 1.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: "pointer"
              }}
            >
              Choose File
            </button>
          </label>
          {file && <p style={{ marginTop: "1rem" }}>📂 {file.name}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 2rem",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#000",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default UploadForm;

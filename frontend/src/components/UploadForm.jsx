// src/components/UploadForm.jsx
import React, { useState, useCallback } from "react";
import axios from "axios";
import { Upload } from "lucide-react";

function UploadForm({ onReport }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("⚠️ Please select or drag a file before uploading.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/analyze",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onReport(response.data);
    } catch (err) {
      setError("❌ Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onDragEnter={handleDrag}
      className="w-full max-w-xl mx-auto flex flex-col items-center gap-4"
    >
      {/* Drag & Drop area */}
      <label
        className={`w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 
          ${
            dragActive
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30"
          }`}
      >
        <Upload className="w-10 h-10 text-blue-600 mb-3" />
        <p className="text-gray-700 font-medium">
          {file ? file.name : "Drag & Drop your XML file here"}
        </p>
        <p className="text-sm text-gray-500">or click to select a file</p>
        <input
          type="file"
          accept=".xml"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-300 
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Error message */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Handle drop outside label */}
      {dragActive && (
        <div
          className="absolute inset-0 z-50"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
}

export default UploadForm;

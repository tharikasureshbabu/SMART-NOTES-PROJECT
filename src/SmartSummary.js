import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function SmartSummary({ onBackHome }) {
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const cleanSummary = (text) => {
    return (text || "")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
      .trim();
  };

  const handleGenerateSummary = async () => {
    if (!content.trim()) {
      setError("Please enter some content first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSaveMessage("");
      setSummary("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/generate-summary",
        {
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setSummary(cleanSummary(response.data.summary || ""));
    } catch (err) {
      console.error("Summary error:", err);
      setError(err.response?.data?.message || "Unable to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document (.docx).");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSaveMessage("");
      setSummary("");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("document", file);

      const response = await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/upload-document",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setContent(response.data.text || "");
      setFileName(file.name);
    } catch (err) {
      console.error("Document upload error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to upload and read the document.",
      );
      setFileName("");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSaveSummary = async () => {
    if (!summary.trim()) {
      setError("Please generate a summary first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSaveMessage("");

      const token = localStorage.getItem("token");

      await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/notes",
        {
          title: fileName ? `Smart Summary - ${fileName}` : "Smart Summary",
          content: summary,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setSaveMessage("Summary saved successfully!");
    } catch (err) {
      console.error("Save summary error:", err);
      setError(err.response?.data?.message || "Unable to save summary.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="audio-page">
      <header className="audio-header">
        <button className="back-home-button" onClick={onBackHome}>
          ← Back to Home
        </button>

        <h1>Smart Summary</h1>

        <p>Convert your learning content into a clear and concise summary.</p>
      </header>

      <main className="audio-content">
        <div className="audio-card">
          <div className="audio-icon">✨</div>

          <h2>Generate Smart Summary</h2>

          <p>
            Enter your content or upload a document and let AI summarize it.
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "25px",
              border: "2px dashed #d9ddf2",
              borderRadius: "14px",
              background: "#fafbff",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px",
                color: "#172554",
              }}
            >
              Upload Document
            </h3>

            <p
              style={{
                margin: "0 0 18px",
                color: "#718096",
                fontSize: "14px",
              }}
            >
              Upload a PDF or Word document to extract its content.
            </p>

            <label
              htmlFor="document-upload"
              className="transcribe-button"
              style={{
                display: "inline-block",
                cursor: uploading ? "not-allowed" : "pointer",
                opacity: uploading ? 0.7 : 1,
              }}
            >
              {uploading ? "Reading Document..." : "Upload PDF / Word"}
            </label>

            <input
              id="document-upload"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleDocumentUpload}
              disabled={uploading}
              style={{ display: "none" }}
            />

            {fileName && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#eef0ff",
                  color: "#5b5bd6",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                File selected: {fileName}
              </div>
            )}
          </div>

          <div
            style={{
              margin: "25px 0",
              color: "#9ca3af",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            OR
          </div>

          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setFileName("");
            }}
            placeholder="Paste or type your learning content here..."
            rows="10"
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              resize: "vertical",
              fontSize: "15px",
              marginTop: "5px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />

          <button
            type="button"
            className="transcribe-button"
            onClick={handleGenerateSummary}
            disabled={loading || uploading}
          >
            {loading ? "Generating Summary..." : "Generate Summary"}
          </button>

          {error && <div className="audio-error">{error}</div>}

          {summary && (
            <div className="transcription-result">
              <h3>Smart Summary</h3>

              <p>{summary}</p>

              <button
                type="button"
                className="transcribe-button"
                onClick={handleSaveSummary}
                disabled={saving}
              >
                {saving ? "Saving Summary..." : "Save Summary"}
              </button>

              {saveMessage && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#ecfdf5",
                    color: "#16a34a",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {saveMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SmartSummary;

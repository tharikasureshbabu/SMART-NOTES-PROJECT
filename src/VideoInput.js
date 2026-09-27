import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function VideoInput({ onBackHome }) {
  const [videoFile, setVideoFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [summarySaveLoading, setSummarySaveLoading] = useState(false);
  const [summarySaveMessage, setSummarySaveMessage] = useState("");

  // ================================
  // TRANSCRIBE VIDEO
  // ================================

  const handleTranscribe = async () => {
    if (!videoFile) {
      setError("Please select a video file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTranscription("");
      setSummary("");
      setSaveMessage("");
      setSummarySaveMessage("");

      const formData = new FormData();
      formData.append("file", videoFile);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/transcribe",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Video transcription response:", response.data);

      setTranscription(response.data.transcript || "");
    } catch (err) {
      console.error("Video transcription error:", err);

      setError(
        err.response?.data?.message || "Unable to transcribe the video.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // SAVE TRANSCRIPTION
  // ================================

  const handleSaveTranscription = async () => {
    if (!transcription.trim()) {
      setError("No transcription available to save.");
      return;
    }

    try {
      setSaveLoading(true);
      setSaveMessage("");
      setError("");

      const token = localStorage.getItem("token");

      await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/notes",
        {
          title: "Video Input Note",
          content: transcription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setSaveMessage("✅ Transcription saved successfully!");
    } catch (err) {
      console.error("Save transcription error:", err);

      setError(
        err.response?.data?.message || "Unable to save the transcription.",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // ================================
  // GENERATE SUMMARY
  // ================================

  const handleGenerateSummary = async () => {
    if (!transcription.trim()) {
      setError("Please transcribe the video first.");
      return;
    }

    try {
      setSummaryLoading(true);
      setError("");
      setSummary("");
      setSummarySaveMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/generate-summary",
        {
          content: transcription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Summary response:", response.data);

      setSummary(
        (response.data.summary || "")
          .replace(/^#{1,6}\s*/gm, "")
          .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
          .trim(),
      );    } catch (err) {
      console.error("Summary error:", err);

      setError(err.response?.data?.message || "Unable to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  // ================================
  // SAVE SUMMARY
  // ================================

  const handleSaveSummary = async () => {
    if (!summary.trim()) {
      setError("No summary available to save.");
      return;
    }

    try {
      setSummarySaveLoading(true);
      setSummarySaveMessage("");
      setError("");

      const token = localStorage.getItem("token");

      await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/notes",
        {
          title: "Video Summary",
          content: summary,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setSummarySaveMessage("✅ Summary saved successfully!");
    } catch (err) {
      console.error("Save summary error:", err);

      setError(err.response?.data?.message || "Unable to save the summary.");
    } finally {
      setSummarySaveLoading(false);
    }
  };

  return (
    <div className="audio-page">
      {/* ================================
          HEADER
      ================================= */}

      <header className="audio-header">
        <button className="back-home-button" onClick={onBackHome}>
          ← Back to Home
        </button>

        <h1>Video Input</h1>

        <p>Upload a video and convert the spoken content into useful text.</p>
      </header>

      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="audio-content">
        <div className="audio-card">
          <div className="audio-icon">🎥</div>

          <h2>Upload Video</h2>

          <p>Select a video file to get started.</p>

          {/* ================================
              HOW IT WORKS
          ================================= */}

          <div className="audio-steps">
            <div className="audio-step">
              <span>📁</span>
              <strong>Upload</strong>
              <small>Choose your video file</small>
            </div>

            <div className="audio-step">
              <span>📝</span>
              <strong>Transcribe</strong>
              <small>Convert video speech to text</small>
            </div>

            <div className="audio-step">
              <span>✨</span>
              <strong>Summarize</strong>
              <small>Generate smart notes</small>
            </div>
          </div>

          {/* ================================
              UPLOAD AREA
          ================================= */}

          <div className="audio-upload-area">
            <label>
              <span className="upload-symbol">📁</span>

              <span>Choose Video File</span>

              <small>MP4, MOV, AVI, MKV and other supported formats</small>

              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  setVideoFile(e.target.files[0]);
                  setError("");
                  setTranscription("");
                  setSummary("");
                  setSaveMessage("");
                  setSummarySaveMessage("");
                }}
              />
            </label>

            {/* SELECTED VIDEO */}

            {videoFile && (
              <div className="selected-audio">
                🎬 Selected: {videoFile.name}
              </div>
            )}

            {/* TRANSCRIBE BUTTON */}

            {videoFile && (
              <button
                type="button"
                className="transcribe-button"
                onClick={handleTranscribe}
                disabled={loading}
              >
                {loading ? "Transcribing..." : "🎥 Transcribe Video"}
              </button>
            )}

            {/* ERROR */}

            {error && <div className="audio-error">{error}</div>}

            {/* ================================
                TRANSCRIPTION RESULT
            ================================= */}

            {transcription && (
              <div className="transcription-result">
                <h3>Video Transcription</h3>

                <p>{transcription}</p>

                {/* GENERATE SUMMARY */}

                <button
                  type="button"
                  className="transcribe-button"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                >
                  {summaryLoading
                    ? "Generating Summary..."
                    : "✨ Generate Summary"}
                </button>

                {/* SAVE TRANSCRIPTION */}

                <button
                  type="button"
                  className="transcribe-button"
                  onClick={handleSaveTranscription}
                  disabled={saveLoading}
                  style={{ marginTop: "20px" }}
                >
                  {saveLoading ? "Saving..." : "💾 Save as Note"}
                </button>

                {saveMessage && (
                  <p
                    style={{
                      marginTop: "15px",
                      color: "#27ae60",
                      fontWeight: "600",
                    }}
                  >
                    {saveMessage}
                  </p>
                )}
              </div>
            )}

            {/* ================================
                SUMMARY RESULT
            ================================= */}

            {summary && (
              <div
                className="transcription-result"
                style={{ marginTop: "30px" }}
              >
                <h3>✨ Smart Summary</h3>

                <p>{summary}</p>

                {/* SAVE SUMMARY */}

                <button
                  type="button"
                  className="transcribe-button"
                  onClick={handleSaveSummary}
                  disabled={summarySaveLoading}
                  style={{ marginTop: "20px" }}
                >
                  {summarySaveLoading ? "Saving Summary..." : "💾 Save Summary"}
                </button>

                {summarySaveMessage && (
                  <p
                    style={{
                      marginTop: "15px",
                      color: "#27ae60",
                      fontWeight: "600",
                    }}
                  >
                    {summarySaveMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default VideoInput;

import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function AudioInput({ onBackHome }) {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarySaveLoading, setSummarySaveLoading] = useState(false);
  const [summarySaveMessage, setSummarySaveMessage] = useState("");
  const [error, setError] = useState("");
  const handleTranscribe = async () => {
    if (!audioFile) {
      setError("Please select an audio file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTranscription("");

      const formData = new FormData();
      formData.append("file", audioFile);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/transcribe",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

     console.log("Transcription response:", response.data);

const transcriptText = response.data.transcript;

console.log("TRANSCRIPT RECEIVED:", transcriptText);

setTranscription(transcriptText);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to transcribe the audio.",
      );
    } finally {
      setLoading(false);
    }
  };
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
        "http://localhost:5000/api/notes",
        {
          title: "Audio Summary",
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
      "http://localhost:5000/api/notes",
      {
        title: "Audio Input Note",
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
const handleGenerateSummary = async () => {
  if (!transcription.trim()) {
    setError("No transcription available to summarize.");
    return;
  }

  try {
    setSummaryLoading(true);
    setSummary("");
    setSummarySaveMessage("");
    setError("");

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/generate-summary",
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

    console.log("Audio summary response:", response.data);

setSummary(
  (response.data.summary || "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .trim(),
);  } catch (err) {
    console.error("Summary error:", err);

    setError(err.response?.data?.message || "Unable to generate summary.");
  } finally {
    setSummaryLoading(false);
  }
};
  return (
    <div className="audio-page">
      <header className="audio-header">
        <button className="back-home-button" onClick={onBackHome}>
          ← Back to Home
        </button>

        <h1>Audio Input</h1>

        <p>
          Upload an audio file and convert your lecture or discussion into
          useful notes.
        </p>
      </header>

      <main className="audio-content">
        <div className="audio-card">
          <div className="audio-icon">🎙️</div>

          <h2>Upload Audio</h2>

          <p>Select an audio file to get started.</p>
          <div className="audio-steps">
            <div className="audio-step">
              <span>📁</span>
              <strong>Upload</strong>
              <small>Choose your audio file</small>
            </div>

            <div className="audio-step">
              <span>📝</span>
              <strong>Transcribe</strong>
              <small>Convert audio to text</small>
            </div>

            <div className="audio-step">
              <span>✨</span>
              <strong>Summarize</strong>
              <small>Generate smart notes</small>
            </div>
          </div>
          <div className="audio-upload-area">
            <label>
              <span className="upload-symbol">📁</span>
              <span>Choose Audio File</span>
              <small>MP3, WAV, M4A and other supported formats</small>

              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
              />
            </label>

            {audioFile && (
              <div className="selected-audio">
                🎵 Selected: {audioFile.name}
              </div>
            )}

            {audioFile && (
              <button
                type="button"
                className="transcribe-button"
                onClick={handleTranscribe}
                disabled={loading}
              >
                {loading ? "Transcribing..." : "🎙️ Transcribe Audio"}
              </button>
            )}

            {error && <div className="audio-error">{error}</div>}

            {transcription && (
              <div className="transcription-result">
                <h3>Transcription</h3>
                <p>{transcription}</p>
                <button
                  type="button"
                  className="transcribe-button"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                  style={{ marginTop: "20px" }}
                >
                  {summaryLoading
                    ? "Generating Summary..."
                    : "✨ Generate Summary"}
                </button>

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
                {summary && (
                  <div
                    className="transcription-result"
                    style={{ marginTop: "30px" }}
                  >
                    <h3>✨ Summary</h3>

                    <p>{summary}</p>

                    <button
                      type="button"
                      className="transcribe-button"
                      onClick={handleSaveSummary}
                      disabled={summarySaveLoading}
                      style={{ marginTop: "20px" }}
                    >
                      {summarySaveLoading
                        ? "Saving Summary..."
                        : "💾 Save Summary"}
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AudioInput;

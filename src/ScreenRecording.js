import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function ScreenRecording({ onBackHome }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");

  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [summarySaveLoading, setSummarySaveLoading] = useState(false);
  const [summarySaveMessage, setSummarySaveMessage] = useState("");

  const [error, setError] = useState("");

  // ================================
  // START SCREEN RECORDING
  // ================================

  const startRecording = async () => {
    try {
      setError("");
      setRecording(null);
      setTranscription("");
      setSummary("");
      setSaveMessage("");
      setSummarySaveMessage("");

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const microphoneStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...microphoneStream.getAudioTracks(),
      ]);

      const mediaRecorder = new MediaRecorder(combinedStream);

      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, {
          type: "video/webm",
        });

        const recordedFile = new File([blob], "screen-recording.webm", {
          type: "video/webm",
        });

        setRecording(recordedFile);
        setLoading(true);
        setError("");
        setTranscription("");

        try {
          const formData = new FormData();

          formData.append("file", recordedFile);

          const token = localStorage.getItem("token");

          const response = await axios.post(
            "http://localhost:5000/api/transcribe",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          console.log("Screen recording transcription:", response.data);

          setTranscription(response.data.transcript || "");
        } catch (err) {
          console.error("Screen transcription error:", err);

          setError(
            err.response?.data?.message ||
              "Unable to transcribe the screen recording.",
          );
        } finally {
          setLoading(false);

          screenStream.getTracks().forEach((track) => track.stop());

          microphoneStream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();

      window.currentMediaRecorder = mediaRecorder;

      setIsRecording(true);
    } catch (err) {
      console.error("Screen recording error:", err);

      setError("Screen recording permission was cancelled or unavailable.");
    }
  };

  // ================================
  // STOP SCREEN RECORDING
  // ================================

  const stopRecording = () => {
    if (window.currentMediaRecorder) {
      window.currentMediaRecorder.stop();
      window.currentMediaRecorder = null;
    }

    setIsRecording(false);
  };

  // ================================
  // GENERATE SUMMARY
  // ================================

  const handleGenerateSummary = async () => {
    if (!transcription.trim()) {
      setError("No transcription available to summarize.");
      return;
    }

    try {
      setSummaryLoading(true);
      setError("");
      setSummary("");
      setSummarySaveMessage("");

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

      console.log("Screen recording summary:", response.data);

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
        "http://localhost:5000/api/notes",
        {
          title: "Screen Recording Transcription",
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
        "http://localhost:5000/api/notes",
        {
          title: "Screen Recording Summary",
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

        <h1>Screen Recording</h1>

        <p>
          Record your screen and convert the recorded content into useful notes.
        </p>
      </header>

      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="audio-content">
        <div className="audio-card">
          <div className="audio-icon">🖥️</div>

          <h2>Screen Recording Input</h2>

          <p>Start recording your screen to capture learning content.</p>

          {/* ================================
              HOW IT WORKS
          ================================= */}

          {!isRecording && !recording && (
            <div className="audio-steps">
              <div className="audio-step">
                <span>🖥️</span>
                <strong>Record</strong>
                <small>Capture your screen</small>
              </div>

              <div className="audio-step">
                <span>📝</span>
                <strong>Transcribe</strong>
                <small>Convert speech to text</small>
              </div>

              <div className="audio-step">
                <span>✨</span>
                <strong>Summarize</strong>
                <small>Generate smart notes</small>
              </div>
            </div>
          )}

          {/* ================================
              START RECORDING
          ================================= */}

          {!isRecording && !recording && (
            <button
              type="button"
              className="transcribe-button"
              onClick={startRecording}
            >
              🔴 Start Screen Recording
            </button>
          )}

          {/* ================================
              RECORDING IN PROGRESS
          ================================= */}

          {isRecording && (
            <div>
              <p
                style={{
                  color: "#e74c3c",
                  fontWeight: "600",
                  marginTop: "25px",
                }}
              >
                🔴 Recording in progress...
              </p>

              <button
                type="button"
                className="transcribe-button"
                onClick={stopRecording}
              >
                ⏹️ Stop Recording
              </button>
            </div>
          )}

          {/* ================================
              RECORDING COMPLETED
          ================================= */}

          {recording && !isRecording && (
            <div className="transcription-result">
              <h3>✅ Recording Completed</h3>

              <p>Your screen recording has been successfully captured.</p>

              <p>
                File: <strong>{recording.name}</strong>
              </p>

              {/* TRANSCRIPTION LOADING */}

              {loading && (
                <p
                  style={{
                    marginTop: "15px",
                    fontWeight: "600",
                  }}
                >
                  🎙️ Converting your recording to text...
                </p>
              )}

              {/* ================================
                  TRANSCRIPTION
              ================================= */}

              {transcription && (
                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "left",
                  }}
                >
                  <h3>📝 Transcription</h3>

                  <p
                    style={{
                      whiteSpace: "pre-line",
                      lineHeight: "1.7",
                      marginTop: "10px",
                    }}
                  >
                    {transcription}
                  </p>

                  {/* GENERATE SUMMARY */}

                  <button
                    type="button"
                    className="transcribe-button"
                    onClick={handleGenerateSummary}
                    disabled={summaryLoading}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    {summaryLoading
                      ? "Generating Summary..."
                      : "✨ Generate Smart Summary"}
                  </button>

                  {/* SAVE TRANSCRIPTION */}

                  <button
                    type="button"
                    className="transcribe-button"
                    onClick={handleSaveTranscription}
                    disabled={saveLoading}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    {saveLoading ? "Saving..." : "💾 Save Transcription"}
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

                  {/* ================================
                      SUMMARY
                  ================================= */}

                  {summary && (
                    <div
                      className="transcription-result"
                      style={{
                        marginTop: "30px",
                      }}
                    >
                      <h3>✨ Smart Summary</h3>

                      <div
                        style={{
                          whiteSpace: "pre-line",
                          lineHeight: "1.7",
                        }}
                      >
                        {summary}
                      </div>

                      {/* SAVE SUMMARY */}

                      <button
                        type="button"
                        className="transcribe-button"
                        onClick={handleSaveSummary}
                        disabled={summarySaveLoading}
                        style={{
                          marginTop: "20px",
                        }}
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
          )}

          {/* ERROR */}

          {error && <div className="audio-error">{error}</div>}
        </div>
      </main>
    </div>
  );
}

export default ScreenRecording;

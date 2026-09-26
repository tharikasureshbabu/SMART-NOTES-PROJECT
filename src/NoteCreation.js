import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function NoteCreation({ onBackHome }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSaveNote = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and note content.");
      return;
    }

    try {
     const token = localStorage.getItem("token");

     const response = await axios.post(
       "http://localhost:5000/api/notes",
       {
         title,
         content,
       },
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       },
     );

      setMessage(response.data.message || "Note saved successfully!");

      setTitle("");
      setContent("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the note. Please try again.",
      );
    }
  };

  return (
    <div className="note-page">
      <header className="note-header">
        <button className="back-button" onClick={onBackHome}>
          ← Back to Home
        </button>

        <h1>Create Note</h1>

        <div className="note-header-space"></div>
      </header>

      <main className="note-content">
        <div className="note-card">
          <div className="note-intro">
            <div className="note-icon">📝</div>

            <div>
              <h2>Create a New Note</h2>
              <p>Write and organize your learning material.</p>
            </div>
          </div>

          <form onSubmit={handleSaveNote}>
            <div className="note-input-group">
              <label>Note Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your note title"
              />
            </div>

            <div className="note-input-group">
              <label>Note Content</label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your notes here..."
                rows="12"
              />
            </div>

            {error && <p className="note-error">{error}</p>}

            {message && <p className="note-success">{message}</p>}

            <div className="note-actions">
              <button
                type="button"
                className="note-cancel-button"
                onClick={onBackHome}
              >
                Cancel
              </button>

              <button type="submit" className="note-save-button">
                Save Note
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default NoteCreation;

import React, { useEffect, useState } from "react";
import "./App.css";

function NoteManagement({ onBackHome }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch notes");
        }

        setNotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setError("");
  };

  const handleBackToNotes = () => {
    setSelectedNote(null);
    setIsEditing(false);
    setError("");
  };

  const handleEditNote = () => {
    setIsEditing(true);
    setError("");
  };

  const handleCancelEdit = () => {
    const originalNote = notes.find((note) => note._id === selectedNote._id);

    if (originalNote) {
      setSelectedNote(originalNote);
    }

    setIsEditing(false);
    setError("");
  };

  const handleUpdateNote = async () => {
    if (!selectedNote) return;

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: selectedNote.title,
            content: selectedNote.content,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === data._id ? data : note)),
      );

      setSelectedNote(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNote) return;

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== selectedNote._id),
      );

      setSelectedNote(null);
      setIsEditing(false);
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="nm-page">
        <div className="nm-loading">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="nm-page">
      {/* HEADER */}
      <header className="nm-header">
        <div className="nm-brand">
          <span className="nm-brand-icon">📖</span>
          <span>Smart Notes</span>
        </div>

        <button className="nm-home-button" onClick={onBackHome}>
          Back to Home
        </button>
      </header>

      {/* MAIN */}
      <main className="nm-main">
        {!selectedNote ? (
          <>
            {/* PAGE INTRO */}
            <section className="nm-intro">
              <h1>My Notes</h1>
              <p>View and manage all your saved notes.</p>
            </section>

            {error && <div className="nm-error">{error}</div>}

            {/* NOTE GRID */}
            {notes.length === 0 ? (
              <div className="nm-empty">
                <div className="nm-empty-icon">📝</div>
                <h2>No Notes Yet</h2>
                <p>Create your first note and it will appear here.</p>
              </div>
            ) : (
              <section className="nm-grid">
                {notes.map((note) => (
                  <article className="nm-note-card" key={note._id}>
                    <div className="nm-note-icon">📝</div>

                    <h3>{note.title}</h3>

                    <p>
                      {note.content.length > 170
                        ? `${note.content.substring(0, 170)}...`
                        : note.content}
                    </p>

                    <button
                      className="nm-view-button"
                      onClick={() => handleViewNote(note)}
                    >
                      View Note
                    </button>
                  </article>
                ))}
              </section>
            )}
          </>
        ) : (
          /* SELECTED NOTE */
          <section className="nm-detail-section">
            <button className="nm-back-button" onClick={handleBackToNotes}>
              ← Back to Notes
            </button>

            {error && <div className="nm-error">{error}</div>}

            <div className="nm-detail-card">
              {!isEditing ? (
                <>
                  <div className="nm-detail-top">
                    <div>
                      <span className="nm-detail-label">SAVED NOTE</span>

                      <h1>{selectedNote.title}</h1>
                    </div>
                  </div>

                  <div className="nm-detail-content">
                    {selectedNote.content}
                  </div>

                  <div className="nm-actions">
                    <button className="nm-edit-button" onClick={handleEditNote}>
                      Edit Note
                    </button>

                    <button
                      className="nm-delete-button"
                      onClick={handleDeleteClick}
                    >
                      Delete Note
                    </button>
                  </div>
                </>
              ) : (
                /* EDIT FORM */
                <div className="nm-edit-form">
                  <div className="nm-edit-heading">
                    <span className="nm-detail-label">EDIT NOTE</span>

                    <h1>Edit Your Note</h1>

                    <p>Make your changes below and save them.</p>
                  </div>

                  <div className="nm-field">
                    <label htmlFor="note-title">Note Title</label>

                    <input
                      id="note-title"
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="nm-field">
                    <label htmlFor="note-content">Note Content</label>

                    <textarea
                      id="note-content"
                      value={selectedNote.content}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="nm-actions">
                    <button
                      className="nm-cancel-button"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>

                    <button
                      className="nm-save-button"
                      onClick={handleUpdateNote}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="nm-modal-overlay">
          <div className="nm-modal">
            <div className="nm-modal-icon">!</div>

            <h2>Delete Note?</h2>

            <p>
              Are you sure you want to delete this note?
              <br />
              This action cannot be undone.
            </p>

            <div className="nm-modal-actions">
              <button className="nm-modal-cancel" onClick={handleCancelDelete}>
                Cancel
              </button>

              <button className="nm-modal-delete" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteManagement;

import React from "react";
import "./App.css";

function Home({
  onCreateNote,
  onManageNotes,
  onAudioInput,
  onVideoInput,
  onScreenRecording,
  onSmartSummary,
  onTranslate,
  onLogout,
}) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img src="/logo1.png" alt="Smart Notes" />
          </div>
          <span>Smart Notes</span>
        </div>

        <nav className="sidebar-menu">
          <button className="sidebar-item active">
            <span className="sidebar-icon">⌂</span>
            <span>Home</span>
          </button>

          <button className="sidebar-item" onClick={onCreateNote}>
            <span className="sidebar-icon">▤</span>
            <span>Create Notes</span>
          </button>

          <button className="sidebar-item" onClick={onManageNotes}>
            <span className="sidebar-icon">▥</span>
            <span>My Notes</span>
          </button>

          <button className="sidebar-item" onClick={onAudioInput}>
            <span className="sidebar-icon">◉</span>
            <span>Audio Input</span>
          </button>

          <button className="sidebar-item" onClick={onVideoInput}>
            <span className="sidebar-icon">▷</span>
            <span>Video Input</span>
          </button>

          <button className="sidebar-item" onClick={onScreenRecording}>
            <span className="sidebar-icon">▣</span>
            <span>Screen Recording</span>
          </button>

          <button className="sidebar-item" onClick={onSmartSummary}>
            <span className="sidebar-icon">✦</span>
            <span>Smart Summary</span>
          </button>

          <button className="sidebar-item" onClick={onTranslate}>
            <span className="sidebar-icon">文</span>
            <span>Translate</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-logout" onClick={onLogout}>
            <span className="sidebar-icon">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <h1>Welcome, {user?.name || "User"}!</h1>

            <p>Organize your learning and make every note more meaningful.</p>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-user-avatar">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.name || "User"}</strong>
              <span>Student</span>
            </div>
          </div>
        </header>

        <section className="dashboard-intro">
          <h2>Your Learning Workspace</h2>

          <p>
            Everything you need to create, manage and understand your learning
            materials in one place.
          </p>
        </section>

        <section className="dashboard-cards">
          {/* Create Notes */}
          <div className="dashboard-card">
            <div className="dashboard-card-icon purple">▤</div>

            <h3>Create Notes</h3>

            <p>Write, organize and save your notes in one place.</p>

            <button onClick={onCreateNote}>Create Note</button>
          </div>

          {/* My Notes */}
          <div className="dashboard-card">
            <div className="dashboard-card-icon blue">▥</div>

            <h3>My Notes</h3>

            <p>Access, edit and manage all your saved notes easily.</p>

            <button onClick={onManageNotes}>View Notes</button>
          </div>

          {/* Audio */}
          <div className="dashboard-card">
            <div className="dashboard-card-icon green">◉</div>

            <h3>Audio Input</h3>

            <p>Convert spoken content into clear and useful notes.</p>

            <button onClick={onAudioInput}>Explore</button>
          </div>

          {/* Video */}
          <div className="dashboard-card">
            <div className="dashboard-card-icon orange">▷</div>

            <h3>Video Input</h3>

            <p>Extract learning content from videos and turn it into notes.</p>

            <button onClick={onVideoInput}>Explore</button>
          </div>

          {/* Screen Recording */}
          <div className="dashboard-card">
            <div className="dashboard-card-icon pink">▣</div>

            <h3>Screen Recording</h3>

            <p>
              Capture your screen and transform recorded content into notes.
            </p>

            <button onClick={onScreenRecording}>Start Recording</button>
          </div>

          {/* Smart Summary */}
          <div className="dashboard-card">
            <div className="dashboard-card-icon violet">✦</div>

            <h3>Smart Summary</h3>

            <p>Generate concise summaries from your learning materials.</p>

            <button onClick={onSmartSummary}>Generate Summary</button>
          </div>

          {/* Translate */}
          <div className="dashboard-card dashboard-card-centered">
            <div className="dashboard-card-icon blue">文</div>

            <h3>Translate</h3>

            <p>
              Translate your notes and learning content into different
              languages.
            </p>

            <button onClick={onTranslate}>Translate</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;

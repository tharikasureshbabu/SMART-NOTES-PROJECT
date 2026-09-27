import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Register from "./Register";
import Home from "./Home";
import NoteCreation from "./NoteCreation";
import NoteManagement from "./NoteManagement";
import AudioInput from "./AudioInput";
import VideoInput from "./VideoInput";
import ScreenRecording from "./ScreenRecording";
import SmartSummary from "./SmartSummary";
import Translate from "./Translate";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showNoteCreation, setShowNoteCreation] = useState(false);
  const [showNoteManagement, setShowNoteManagement] = useState(false);
  const [showAudioInput, setShowAudioInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showScreenRecording, setShowScreenRecording] = useState(false);
  const [showSmartSummary, setShowSmartSummary] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setMessage(response.data.message);

        setTimeout(() => {
          setIsLoggedIn(true);
        }, 500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setShowRegister(false);

    setShowNoteCreation(false);
    setShowNoteManagement(false);
    setShowAudioInput(false);
    setShowVideoInput(false);
    setShowScreenRecording(false);
    setShowSmartSummary(false);
    setShowTranslate(false);

    setEmail("");
    setPassword("");
    setError("");
    setMessage("");
  };

  if (showNoteCreation) {
    return <NoteCreation onBackHome={() => setShowNoteCreation(false)} />;
  }

  if (isLoggedIn) {
    if (showNoteManagement) {
      return <NoteManagement onBackHome={() => setShowNoteManagement(false)} />;
    }

    if (showAudioInput) {
      return <AudioInput onBackHome={() => setShowAudioInput(false)} />;
    }

    if (showVideoInput) {
      return <VideoInput onBackHome={() => setShowVideoInput(false)} />;
    }

    if (showScreenRecording) {
      return (
        <ScreenRecording onBackHome={() => setShowScreenRecording(false)} />
      );
    }

    if (showSmartSummary) {
      return <SmartSummary onBackHome={() => setShowSmartSummary(false)} />;
    }

    if (showTranslate) {
      return <Translate onBackHome={() => setShowTranslate(false)} />;
    }

    return (
      <Home
        onCreateNote={() => setShowNoteCreation(true)}
        onManageNotes={() => setShowNoteManagement(true)}
        onAudioInput={() => setShowAudioInput(true)}
        onVideoInput={() => setShowVideoInput(true)}
        onScreenRecording={() => setShowScreenRecording(true)}
        onSmartSummary={() => setShowSmartSummary(true)}
        onTranslate={() => setShowTranslate(true)}
        onLogout={handleLogout}
      />
    );
  }

  if (showRegister) {
    return <Register onBackToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="brand-section">
            <h1>Smart Notes</h1>
            <p>Your intelligent learning companion</p>
          </div>

          <div className="illustration">
            <div className="book">📖</div>
            <div className="sparkle sparkle-one">✦</div>
            <div className="sparkle sparkle-two">✦</div>
            <div className="sparkle sparkle-three">✧</div>
          </div>
        </div>

        <div className="login-card">
          <h2>Welcome Back!</h2>

          <p className="login-subtitle">Login to continue to Smart Notes</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button" className="forgot-password">
                Forgot Password?
              </button>
            </div>

            {error && (
              <p
                style={{
                  color: "#e74c3c",
                  fontSize: "13px",
                  marginBottom: "15px",
                }}
              >
                {error}
              </p>
            )}

            {message && (
              <p
                style={{
                  color: "#27ae60",
                  fontSize: "13px",
                  marginBottom: "15px",
                }}
              >
                {message}
              </p>
            )}

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <div className="register-section">
            <span>Don't have an account?</span>

            <button
              type="button"
              className="register-button"
              onClick={() => setShowRegister(true)}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

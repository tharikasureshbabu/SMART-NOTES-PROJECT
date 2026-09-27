import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function Register({ onBackToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://smart-notes-backend-7l6r.onrender.com/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      );

      setMessage(response.data.message || "Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="brand-section">
            <h1>Smart Notes</h1>
            <p>Your intelligent learning companion</p>
          </div>

          <div className="illustration">
            <div className="book">📚</div>
            <div className="sparkle sparkle-one">✦</div>
            <div className="sparkle sparkle-two">✦</div>
            <div className="sparkle sparkle-three">✧</div>
          </div>
        </div>

        <div className="login-card">
          <h2>Create Account</h2>

          <p className="login-subtitle">Create your Smart Notes account</p>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
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
              Create Account
            </button>
          </form>

          <div className="register-section">
            <span>Already have an account?</span>

            <button
              type="button"
              className="register-button"
              onClick={onBackToLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

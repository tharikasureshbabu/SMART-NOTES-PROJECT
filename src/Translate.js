import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function Translate({ onBackHome }) {
  const [content, setContent] = useState("");
  const [fromLanguage, setFromLanguage] = useState("en");
  const [language, setLanguage] = useState("ta");
const [translation, setTranslation] = useState("");
  const handleFromLanguageChange = (value) => {
    setFromLanguage(value);

    if (value === language) {
      setLanguage(value === "en" ? "ta" : "en");
    }
  };
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const handleTranslate = async () => {
    if (!content.trim()) {
      setError("Please enter some content first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSaveMessage("");
      setTranslation("");

      const token = localStorage.getItem("token");

      const translateData = {
        text: content.trim(),
        from: fromLanguage,
        to: language,
      };

      console.log("TRANSLATE DATA:", translateData);

      const response = await axios.post(
        "http://localhost:5000/api/translate",
        translateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Translation response:", response.data);

setTranslation(
  (response.data.structured || "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .trim(),
);    } catch (err) {
      console.error("Translation error:", err);

      setError(
        err.response?.data?.message || "Unable to translate the content.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getLanguageName = () => {
    const languages = {
      ta: "Tamil",
      hi: "Hindi",
      te: "Telugu",
      ml: "Malayalam",
      kn: "Kannada",
      bn: "Bengali",
      mr: "Marathi",
      gu: "Gujarati",
      pa: "Punjabi",
      ur: "Urdu",
      es: "Spanish",
      fr: "French",
      de: "German",
      pt: "Portuguese",
      it: "Italian",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
    };

    return languages[language] || "Translation";
  };

  const handleSaveTranslation = async () => {
    if (!translation.trim()) {
      setError("Please translate the content first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSaveMessage("");

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/notes",
        {
          title: `English to ${getLanguageName()} Translation`,
          content: translation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setSaveMessage("Translation saved successfully!");
    } catch (err) {
      console.error("Save translation error:", err);

      setError(err.response?.data?.message || "Unable to save translation.");
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

        <h1>Translate</h1>

        <p>Translate your learning content into your preferred language.</p>
      </header>

      <main className="audio-content">
        <div className="audio-card">
          <div className="audio-icon">🌐</div>

          <h2>Translate Your Content</h2>
          <p>
            Select the source and target languages, then enter your content.
          </p>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter or paste your content here..."
            rows="10"
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              resize: "vertical",
              fontSize: "15px",
              marginTop: "15px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          <button
            type="button"
            onClick={() => {
              setContent("");
              setTranslation("");
              setError("");
              setSaveMessage("");
            }}
            style={{
              marginTop: "10px",
              padding: "9px 18px",
              border: "1px solid #d9ddf2",
              borderRadius: "8px",
              background: "#f5f7ff",
              color: "#5b5bd6",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          <label
            style={{
              display: "block",
              textAlign: "left",
              marginTop: "15px",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#172554",
            }}
          >
            From Language
          </label>
          <select
            value={fromLanguage}
            onChange={(e) => handleFromLanguageChange(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "15px",
            }}
          >
            <option value="en" disabled={fromLanguage === "en"}>
              English
            </option>
            <option value="ta" disabled={fromLanguage === "ta"}>
              Tamil
            </option>
            <option value="hi" disabled={fromLanguage === "hi"}>
              Hindi
            </option>
            <option value="te" disabled={fromLanguage === "te"}>
              Telugu
            </option>
            <option value="ml" disabled={fromLanguage === "ml"}>
              Malayalam
            </option>
            <option value="kn" disabled={fromLanguage === "kn"}>
              Kannada
            </option>
            <option value="bn" disabled={fromLanguage === "bn"}>
              Bengali
            </option>
            <option value="mr" disabled={fromLanguage === "mr"}>
              Marathi
            </option>
            <option value="gu" disabled={fromLanguage === "gu"}>
              Gujarati
            </option>
            <option value="pa" disabled={fromLanguage === "pa"}>
              Punjabi
            </option>
            <option value="ur" disabled={fromLanguage === "ur"}>
              Urdu
            </option>
            <option value="es" disabled={fromLanguage === "es"}>
              Spanish
            </option>
            <option value="fr" disabled={fromLanguage === "fr"}>
              French
            </option>
            <option value="de" disabled={fromLanguage === "de"}>
              German
            </option>
            <option value="pt" disabled={fromLanguage === "pt"}>
              Portuguese
            </option>
            <option value="it" disabled={fromLanguage === "it"}>
              Italian
            </option>
            <option value="zh" disabled={fromLanguage === "zh"}>
              Chinese
            </option>
            <option value="ja" disabled={fromLanguage === "ja"}>
              Japanese
            </option>
            <option value="ko" disabled={fromLanguage === "ko"}>
              Korean
            </option>
          </select>
          <label
            style={{
              display: "block",
              textAlign: "left",
              marginTop: "15px",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#172554",
            }}
          >
            To Language
          </label>
          <button
            type="button"
            onClick={() => {
              setFromLanguage(language);
              setLanguage(fromLanguage);
            }}
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              border: "1px solid #d9ddf2",
              borderRadius: "8px",
              background: "#f5f7ff",
              color: "#5b5bd6",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Swap Languages
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "15px",
            }}
          >
            <option value="en" disabled={fromLanguage === "en"}>
              English
            </option>
            <option value="ta" disabled={fromLanguage === "ta"}>
              Tamil
            </option>
            <option value="hi" disabled={fromLanguage === "hi"}>
              Hindi
            </option>
            <option value="te" disabled={fromLanguage === "te"}>
              Telugu
            </option>
            <option value="ml" disabled={fromLanguage === "ml"}>
              Malayalam
            </option>
            <option value="kn" disabled={fromLanguage === "kn"}>
              Kannada
            </option>
            <option value="bn" disabled={fromLanguage === "bn"}>
              Bengali
            </option>
            <option value="mr" disabled={fromLanguage === "mr"}>
              Marathi
            </option>
            <option value="gu" disabled={fromLanguage === "gu"}>
              Gujarati
            </option>
            <option value="pa" disabled={fromLanguage === "pa"}>
              Punjabi
            </option>
            <option value="ur" disabled={fromLanguage === "ur"}>
              Urdu
            </option>
            <option value="es" disabled={fromLanguage === "es"}>
              Spanish
            </option>
            <option value="fr" disabled={fromLanguage === "fr"}>
              French
            </option>
            <option value="de" disabled={fromLanguage === "de"}>
              German
            </option>
            <option value="pt" disabled={fromLanguage === "pt"}>
              Portuguese
            </option>
            <option value="it" disabled={fromLanguage === "it"}>
              Italian
            </option>
            <option value="zh" disabled={fromLanguage === "zh"}>
              Chinese
            </option>
            <option value="ja" disabled={fromLanguage === "ja"}>
              Japanese
            </option>
            <option value="ko" disabled={fromLanguage === "ko"}>
              Korean
            </option>
          </select>

          <button
            type="button"
            className="transcribe-button"
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? "Translating..." : "🌐 Translate"}
          </button>

          {error && <div className="audio-error">{error}</div>}

          {translation && (
            <div className="transcription-result">
              <h3>🌐 Translated Content</h3>

              <div style={{ whiteSpace: "pre-line" }}>{translation}</div>

              <button
                type="button"
                className="transcribe-button"
                onClick={handleSaveTranslation}
                disabled={saving}
              >
                {saving ? "Saving Translation..." : "💾 Save Translation"}
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

export default Translate;

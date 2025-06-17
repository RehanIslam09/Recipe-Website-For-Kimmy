import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ClaudeRecipe({ chatHistory, onTweakRequest }) {
  const [userTweak, setUserTweak] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (userTweak.trim()) {
      onTweakRequest(userTweak);
      setUserTweak(""); // clear textarea after sending
    }
  }

  return (
    <section
      className="suggested-recipe-container"
      aria-live="polite"
      style={{
        backgroundColor: "#fdf3f3",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Georgia, serif",
        color: "#702c3a",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          color: "#8a2e47",
          marginBottom: "12px",
          fontWeight: "600",
        }}
      >
        Honey & Hearth Recommends:
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#ffe0ec" : "#fff6f7",
              padding: "12px 16px",
              borderRadius: "12px",
              maxWidth: "80%",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              whiteSpace: "pre-wrap",
            }}
          >
            <ReactMarkdown>{msg.message}</ReactMarkdown>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
        {/* <textarea
          placeholder="Want to tweak or improve this recipe? Ask me here..."
          value={userTweak}
          onChange={(e) => setUserTweak(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontFamily: "Inter",
            resize: "vertical",
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: "10px",
            backgroundColor: "#b04a68",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter",
          }}
        >
          ✨ Send Recipe Tweak
        </button> */}
      </form>
    </section>
  );
}

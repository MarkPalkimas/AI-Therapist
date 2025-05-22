import React from "react";

export default function ResponsePanel({ response, intensity }) {
  return (
    <div className="response-section">
      <h3>Therapist Response</h3>
      <p>{response}</p>
      {intensity === "severe" && (
        <div className="alert">
          <strong>Emergency:</strong> If you feel unsafe, please call emergency services immediately.
        </div>
      )}
    </div>
  );
}


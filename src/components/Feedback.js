import React from "react";

export default function Feedback({ onFeedback }) {
  return (
    <div className="feedback-section">
      <p>Was this helpful?</p>
      <div className="feedback-buttons">
        <button onClick={() => onFeedback(true)}>Yes</button>
        <button onClick={() => onFeedback(false)}>No</button>
      </div>
    </div>
  );
}


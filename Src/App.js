import React, { useState } from "react";
import TherapeuticHandler from "./modules/therapeuticHandler";
import { database } from "./firebaseConfig";
import { ref, push } from "firebase/database";

import ResponsePanel from "./components/ResponsePanel";
import EmotionChart from "./components/EmotionChart";
import Feedback from "./components/Feedback";

export default function App() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);

    const handler = new TherapeuticHandler();
    const result = await handler.analyzeInput(text);
    setAnalysis(result);

    await push(ref(database, "moods"), {
      text,
      ...result,
      timestamp: Date.now()
    });

    setText("");
    setLoading(false);
  };

  const handleFeedback = helpful => {
    if (!analysis) return;
    new TherapeuticHandler().provideFeedback(analysis.conversationId, helpful);
  };

  return (
    <div className="app-container">
      <header className="app-header"><h1>AI Therapist</h1></header>
      <div className="input-section">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="How are you feeling today?"
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Thinking..." : "Analyze Mood"}
        </button>
      </div>
      {analysis && (
        <>
          <ResponsePanel {...analysis} />
          <div className="chart-section">
            <h4>Emotion Breakdown</h4>
            <EmotionChart data={analysis.emotions} />
          </div>
          <Feedback onFeedback={handleFeedback} />
        </>
      )}
    </div>
  );
}


// js/main.js
import TherapeuticHandler from "./therapeuticHandler.js";
import { database } from "../src/firebaseConfig.js";  // adjust path if needed
import { ref, push } from "firebase/database";

const therapist = new TherapeuticHandler();
const textInput = document.getElementById("textInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultDiv = document.getElementById("result");
const emotionChartDiv = document.getElementById("emotionChart");
const feedbackDiv = document.getElementById("feedback");

function updateEmotionChart(scores) {
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  emotionChartDiv.innerHTML = sorted
    .map(([e, s]) => `
      <div class="emotion-bar">
        <div class="emotion-label">${e}</div>
        <div class="bar-container">
          <div class="bar" style="width: ${(s * 100).toFixed(1)}%; background: ${getEmotionColor(e)}"></div>
        </div>
        <div class="score">${(s * 100).toFixed(1)}%</div>
      </div>
    `).join("");
}

function getEmotionColor(emotion) {
  const colors = {
    joy: "#FFD700", sadness: "#4169E1", anger: "#FF4500",
    fear: "#800080", surprise: "#00FF7F", love: "#FF69B4",
    anxiety: "#FFA500", disgust: "#32CD32"
  };
  return colors[emotion] || "#64ffda";
}

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(u);
}

analyzeBtn.addEventListener("click", async () => {
  const userText = textInput.value.trim();
  if (!userText) {
    resultDiv.innerHTML = "<p>Please share your thoughts so I can help.</p>";
    return;
  }
  analyzeBtn.disabled = true;
  resultDiv.innerHTML = "<p>Analyzing...</p>";
  feedbackDiv.innerHTML = "";

  const {
    response, emotions, conversationId, dominantEmotion, intensity
  } = await therapist.analyzeInput(userText);

  // Render response
  let html = `<h3>Therapist Response</h3><p>${response}</p>`;
  if (intensity === "severe") {
    html += `
      <div class="alert">
        <strong>Emergency Alert:</strong> If you feel unsafe or are in crisis, call emergency services immediately.
      </div>`;
  }
  resultDiv.innerHTML = html;
  speak(response);
  updateEmotionChart(emotions);

  // Store to Firebase
  push(ref(database, "moods"), {
    text: userText,
    emotions,
    dominantEmotion,
    intensity,
    conversationId,
    timestamp: Date.now()
  }).catch(console.error);

  // Feedback buttons
  feedbackDiv.innerHTML = `
    <p>Was this response helpful?</p>
    <button id="feedbackYes">Yes</button>
    <button id="feedbackNo">No</button>
  `;
  document.getElementById("feedbackYes").onclick = () => {
    therapist.provideFeedback(conversationId, true);
    feedbackDiv.innerHTML = "<p>Thanks for your feedback!</p>";
  };
  document.getElementById("feedbackNo").onclick = () => {
    therapist.provideFeedback(conversationId, false);
    feedbackDiv.innerHTML = "<p>Thanks for your feedback! I'll learn from this.</p>";
  };

  textInput.value = "";
  analyzeBtn.disabled = false;
});

textInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    analyzeBtn.click();
  }
});

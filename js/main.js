// js/main.js
import TherapeuticHandler from "./therapeuticHandler.js";

const therapist = new TherapeuticHandler();
const textInput = document.getElementById("textInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultDiv = document.getElementById("result");
const emotionChartDiv = document.getElementById("emotionChart");
const feedbackDiv = document.getElementById("feedback");

// Helper: update the emotion chart display
function updateEmotionChart(scores) {
  const sortedEmotions = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  emotionChartDiv.innerHTML = sortedEmotions
    .map(
      ([emotion, score]) => `
    <div class="emotion-bar">
      <div class="emotion-label">${emotion}</div>
      <div class="bar-container">
        <div class="bar" style="width: ${(score * 100).toFixed(1)}%; background: ${getEmotionColor(
        emotion
      )}"></div>
      </div>
      <div class="score">${(score * 100).toFixed(1)}%</div>
    </div>
  `
    )
    .join("");
}

// Helper: choose a color based on the emotion
function getEmotionColor(emotion) {
  const colors = {
    joy: "#FFD700",
    sadness: "#4169E1",
    anger: "#FF4500",
    fear: "#800080",
    surprise: "#00FF7F",
    love: "#FF69B4",
    anxiety: "#FFA500",
    disgust: "#32CD32"
  };
  return colors[emotion] || "#64ffda";
}

// Helper: text-to-speech for the response
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
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

  const analysis = await therapist.analyzeInput(userText);
  const { response, emotions, conversationId, dominantEmotion, intensity } = analysis;

  let responseHTML = `<h3>Therapist Response</h3><p>${response}</p>`;
  if (intensity === "severe") {
    responseHTML += `
      <div class="alert">
        <strong>Emergency Alert:</strong> If you feel unsafe or are in crisis, please call emergency services immediately.
      </div>
    `;
  }
  resultDiv.innerHTML = responseHTML;
  speak(response);
  updateEmotionChart(emotions);

  feedbackDiv.innerHTML = `
    <p>Was this response helpful?</p>
    <button id="feedbackYes">Yes</button>
    <button id="feedbackNo">No</button>
  `;
  document.getElementById("feedbackYes").addEventListener("click", () => {
    therapist.provideFeedback(conversationId, true);
    feedbackDiv.innerHTML = "<p>Thanks for your feedback!</p>";
  });
  document.getElementById("feedbackNo").addEventListener("click", () => {
    therapist.provideFeedback(conversationId, false);
    feedbackDiv.innerHTML = "<p>Thanks for your feedback! I'll learn from this.</p>";
  });

  textInput.value = "";
  analyzeBtn.disabled = false;
});

// Allow pressing Enter (without Shift) to trigger analysis.
textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    analyzeBtn.click();
  }
});

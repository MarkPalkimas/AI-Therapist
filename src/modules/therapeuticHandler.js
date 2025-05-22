import analyzeEmotions from "./emotionLearner";

export default class TherapeuticHandler {
  async analyzeInput(text) {
    const emotions = analyzeEmotions(text);
    const sorted = Object.entries(emotions).sort((a,b)=>b[1]-a[1]);
    const [dominant, score] = sorted[0] || ["neutral", 0];
    const intensity = score > 0.5 ? "severe" : "mild";
    const response = `I sense you’re feeling ${dominant}. Would you like to explore that further?`;
    const conversationId = Date.now().toString();
    return { response, emotions, conversationId, intensity };
  }
  provideFeedback(conversationId, helpful) {
    console.log(`Feedback for ${conversationId}: ${helpful}`);
  }
}

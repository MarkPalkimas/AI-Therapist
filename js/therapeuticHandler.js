// js/therapeuticHandler.js
import EmotionLearner from "./emotionLearner.js";
import { FirestoreService } from "./firestoreService.js";

export default class TherapeuticHandler {
  constructor() {
    this.learner = new EmotionLearner();
  }

  async analyzeInput(text) {
    // Get emotion scores
    const emotions = await this.learner.detectEmotions(text);
    // Determine dominant emotion and intensity
    const entries = Object.entries(emotions).sort((a, b) => b[1] - a[1]);
    const dominantEmotion = entries.length ? entries[0][0] : "neutral";
    const intensity =
      entries[0] && entries[0][1] > 0.7
        ? "severe"
        : entries[0][1] > 0.4
        ? "moderate"
        : "mild";

    // Select a response based on the dominant emotion and intensity
    const responses = {
      joy: {
        mild: "I sense a bit of cheer.",
        moderate: "Your happiness shines through!",
        severe: "Your joy is inspiring!"
      },
      sadness: {
        mild: "I know it’s been a little tough.",
        moderate: "I'm sorry you're feeling down.",
        severe: "I'm really concerned about your sadness."
      },
      anger: {
        mild: "I sense some irritation.",
        moderate: "It sounds like anger is building.",
        severe: "I can see that anger is overwhelming you."
      },
      fear: {
        mild: "A bit of worry is natural.",
        moderate: "I understand that fear can be unsettling.",
        severe: "I'm very concerned about your fear."
      },
      default: {
        mild: "Thanks for sharing your thoughts.",
        moderate: "I appreciate you opening up.",
        severe: "I'm really concerned about what you're going through."
      }
    };

    const chosenResponse =
      (responses[dominantEmotion] && responses[dominantEmotion][intensity]) ||
      responses.default[intensity];

    // Prepare conversation data to store in Firestore
    const conversationData = {
      text,
      emotions,
      dominantEmotion,
      intensity,
      riskLevel: intensity === "severe" ? "severe" : "low",
      createdAt: new Date()
    };

    // Save conversation to Firestore and retrieve its ID
    const conversationId = await FirestoreService.saveConversation(conversationData);

    return { response: chosenResponse, emotions, conversationId, dominantEmotion, intensity };
  }

  async provideFeedback(conversationId, isPositive) {
    // Save feedback to Firestore
    await FirestoreService.saveFeedback(conversationId, isPositive);
    console.log("Feedback saved. (Local weights update simulated.)");
  }
}

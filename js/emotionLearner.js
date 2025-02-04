// js/emotionLearner.js
import { emotionLexicon } from "./emotionDataset.js";

export default class EmotionLearner {
  constructor() {
    this.model = null;
    // Define basic patterns for rule-based scoring
    this.patterns = {
      joy: { keywords: ['happy', 'joyful'], weight: 1.0 },
      sadness: { keywords: ['sad', 'depressed'], weight: 1.0 },
      anger: { keywords: ['angry', 'furious'], weight: 1.0 },
      fear: { keywords: ['scared', 'afraid'], weight: 1.0 }
      // Add additional emotions as needed
    };
    this.loadModel();
  }

  async loadModel() {
    // Load the Universal Sentence Encoder model
    this.model = await use.load();
  }

  // Rule-based scoring using the lexicon
  ruleBasedScores(text) {
    const words = text.toLowerCase().split(/\s+/);
    const scores = {};
    words.forEach(word => {
      if (emotionLexicon[word]) {
        const { emotion, score } = emotionLexicon[word];
        scores[emotion] = (scores[emotion] || 0) + score;
      }
    });
    return scores;
  }

  // ML-based scoring using the Universal Sentence Encoder
  async mlScores(text) {
    if (!this.model) await this.loadModel();
    const embeddings = await this.model.embed([text]);
    // Use the mean of the embedding as a proxy for intensity (for demo purposes)
    const embeddingMean = embeddings.mean().dataSync()[0];
    const mlScores = {};
    Object.keys(this.patterns).forEach(emotion => {
      mlScores[emotion] = Math.tanh(embeddingMean * this.patterns[emotion].weight);
    });
    return mlScores;
  }

  // Combine rule-based and ML scores by averaging
  async detectEmotions(text) {
    const ruleScores = this.ruleBasedScores(text);
    const ml = await this.mlScores(text);
    const combined = {};
    const emotions = new Set([...Object.keys(ruleScores), ...Object.keys(ml)]);
    emotions.forEach(emotion => {
      combined[emotion] = ((ruleScores[emotion] || 0) + (ml[emotion] || 0)) / 2;
    });
    return combined;
  }

  // Update weights based on user feedback (client-side simulation)
  updateWeights(emotions, isPositive) {
    const factor = isPositive ? 1.05 : 0.95;
    for (const emotion in emotions) {
      if (this.patterns[emotion]) {
        this.patterns[emotion].weight = Math.min(Math.max(this.patterns[emotion].weight * factor, 0.5), 2.0);
      }
    }
    console.log("Updated local weights:", this.patterns);
  }
}

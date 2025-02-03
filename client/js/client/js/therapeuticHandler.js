// client/js/therapeuticHandler.js
import { emotionLexicon } from './emotionDataset.js';

export default class TherapeuticHandler {
  constructor() {
    // You could initialize any client state here.
  }

  async analyzeInput(text) {
    const res = await fetch('/api/therapy/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return res.json();
  }

  async provideFeedback(conversationId, isPositive) {
    await fetch('/api/therapy/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, isPositive })
    });
  }
}

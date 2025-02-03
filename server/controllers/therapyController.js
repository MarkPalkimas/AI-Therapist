// server/controllers/therapyController.js
const Conversation = require('../models/Conversation');
const Feedback = require('../models/Feedback');
const { predictEmotions, updateWeights, getWeights } = require('../ml/emotionModel');

// A simple rule-based scorer (you can extend this as needed)
function ruleBasedScore(text) {
  const lowerText = text.toLowerCase();
  const scores = {
    joy: lowerText.includes('happy') ? 1.0 : 0,
    sadness: lowerText.includes('sad') ? 1.0 : 0,
    anger: lowerText.includes('angry') ? 1.0 : 0,
    fear: lowerText.includes('scared') ? 1.0 : 0,
    surprise: lowerText.includes('surprised') ? 1.0 : 0,
    love: lowerText.includes('love') ? 1.0 : 0,
    anxiety: lowerText.includes('anxious') ? 1.0 : 0,
    disgust: lowerText.includes('disgust') ? 1.0 : 0
  };
  return scores;
}

// Combine ML and rule-based scores by averaging.
async function analyzeText(text) {
  const mlScores = await predictEmotions(text);
  const ruleScores = ruleBasedScore(text);
  const emotions = {};
  const allEmotions = new Set([...Object.keys(mlScores), ...Object.keys(ruleScores)]);
  allEmotions.forEach(emotion => {
    emotions[emotion] = ((mlScores[emotion] || 0) + (ruleScores[emotion] || 0)) / 2;
  });

  // Determine dominant emotion and intensity.
  const entries = Object.entries(emotions).sort((a, b) => b[1] - a[1]);
  const dominantEmotion = entries.length ? entries[0][0] : 'neutral';
  const intensity = entries[0] && entries[0][1] > 0.7 ? 'severe' : entries[0][1] > 0.4 ? 'moderate' : 'mild';

  // Assess risk (very simple check)
  const riskLevel = text.toLowerCase().match(/suicide|kill|die|hopeless/) || entries[0][1] > 0.9
    ? 'severe'
    : 'low';

  // Select a response (extend with your own responses)
  const responses = {
    joy: {
      mild: "I sense some cheer.",
      moderate: "Your happiness really shows!",
      severe: "Your joy is inspiring!"
    },
    sadness: {
      mild: "I know it's been a bit rough.",
      moderate: "I'm sorry you're feeling down.",
      severe: "I'm very concerned about your sadness."
    },
    // … add other emotions similarly
    default: {
      mild: "Thanks for sharing your feelings.",
      moderate: "I appreciate your honesty. Let's talk more.",
      severe: "I'm really concerned about what you're going through."
    }
  };

  const chosenResponse =
    (responses[dominantEmotion] && responses[dominantEmotion][intensity]) ||
    responses.default[intensity];

  return { emotions, dominantEmotion, intensity, riskLevel, response: chosenResponse };
}

// Controller for analyzing conversation text.
exports.analyze = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    
    const analysis = await analyzeText(text);
    // Save conversation to DB.
    const conv = new Conversation({
      text,
      emotions: analysis.emotions,
      dominantEmotion: analysis.dominantEmotion,
      intensity: analysis.intensity,
      riskLevel: analysis.riskLevel
    });
    await conv.save();

    res.json({ ...analysis, conversationId: conv._id });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for feedback.
exports.feedback = async (req, res) => {
  try {
    const { conversationId, isPositive } = req.body;
    if (!conversationId || typeof isPositive !== 'boolean') {
      return res.status(400).json({ error: 'Invalid input' });
    }
    // Save feedback.
    const fb = new Feedback({ conversationId, isPositive });
    await fb.save();

    // Update our ML model’s weights based on the conversation’s emotions.
    const conv = await Conversation.findById(conversationId);
    if (conv) {
      updateWeights(conv.emotions, isPositive);
    }
    res.json({ message: 'Feedback recorded' });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

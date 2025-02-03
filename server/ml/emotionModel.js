// server/ml/emotionModel.js
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

// A simulated in-memory weight object. In a real system, these would be stored in your DB.
let emotionWeights = {
  joy: 1.0,
  sadness: 1.0,
  anger: 1.0,
  fear: 1.0,
  surprise: 1.0,
  love: 1.0,
  anxiety: 1.0,
  disgust: 1.0
};

// A helper function that “learns” by updating weights
function updateWeights(feedbackEmotions, isPositive) {
  const factor = isPositive ? 1.05 : 0.95;
  for (const emotion in feedbackEmotions) {
    if (emotionWeights[emotion] !== undefined) {
      emotionWeights[emotion] = Math.min(Math.max(emotionWeights[emotion] * factor, 0.5), 2.0);
    }
  }
  // In a real system, save emotionWeights persistently (to DB or file)
  console.log("Updated ML weights:", emotionWeights);
}

// Load Universal Sentence Encoder model once.
let encoder = null;
async function loadEncoder() {
  if (!encoder) {
    encoder = await use.load();
  }
  return encoder;
}

// Simulate predicting emotion scores using embeddings and internal weights.
// (In production you might load a proper TensorFlow model instead.)
async function predictEmotions(text) {
  await loadEncoder();
  const embeddings = await encoder.embed([text]);
  // For demonstration we simulate ML predictions by averaging the embedding’s mean value
  // with our stored weights.
  const embeddingMean = embeddings.mean().dataSync()[0];
  const emotions = Object.keys(emotionWeights).reduce((acc, emotion) => {
    // simulate a prediction score that is modulated by the internal weight and the embedding mean
    acc[emotion] = Math.tanh(embeddingMean * emotionWeights[emotion]);
    return acc;
  }, {});
  return emotions;
}

module.exports = {
  predictEmotions,
  updateWeights,
  getWeights: () => emotionWeights
};

import dataset from "./emotionDataset";

export default function analyzeEmotions(text) {
  const words = text.toLowerCase().split(/\W+/);
  const scores = {};
  Object.entries(dataset).forEach(([emo, keys]) => {
    scores[emo] = words.filter(w => keys.includes(w)).length;
  });
  const total = Math.max(Object.values(scores).reduce((sum, v) => sum + v, 0), 1);
  Object.keys(scores).forEach(k => scores[k] = scores[k] / total);
  return scores;
}

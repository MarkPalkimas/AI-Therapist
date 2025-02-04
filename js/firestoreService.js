// js/firestoreService.js
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase (using the compat SDK for simplicity)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const FirestoreService = {
  saveConversation: async (conversationData) => {
    try {
      const docRef = await db.collection("conversations").add(conversationData);
      return docRef.id;
    } catch (error) {
      console.error("Error saving conversation:", error);
      return null;
    }
  },

  saveFeedback: async (conversationId, isPositive) => {
    try {
      await db.collection("feedback").add({
        conversationId,
        isPositive,
        createdAt: new Date()
      });
      return true;
    } catch (error) {
      console.error("Error saving feedback:", error);
      return false;
    }
  },

  // Optional: Retrieve training data (if needed later).
  getTrainingData: async () => {
    const snapshot = await db.collection("conversations").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

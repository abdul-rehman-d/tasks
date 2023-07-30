import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAgOxjJrrfLEcQdiufUKXCbqHlyhicvPdo",
  authDomain: "technexia-job-test.firebaseapp.com",
  projectId: "technexia-job-test",
  storageBucket: "technexia-job-test.appspot.com",
  messagingSenderId: "399485698177",
  appId: "1:399485698177:web:b2a37322f43c00fecf8d80"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

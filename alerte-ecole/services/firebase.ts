// point de passage
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC8XECMm5kt8YqmFnXFm-vkOSqgRwWm4XA",
  authDomain: "alerteglaisieres.firebaseapp.com",
  projectId: "alerteglaisieres",
  storageBucket: "alerteglaisieres.appspot.com",
  messagingSenderId: "480718090637",
  appId: "1:480718090637:web:de1d3879f88ae694b8cdc4",
  measurementId: "G-Y6MZDL6EE9",
};

// Initialisation Firebase avec persistance pour React Native
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, auth };


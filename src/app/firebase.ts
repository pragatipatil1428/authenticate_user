import { getApp,getApps,initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBKlMSWiYUHxW4VvGy80KjKlfFIqGvOyUA",
  authDomain: "crudoperations-de4a8.firebaseapp.com",
  databaseURL: "https://crudoperations-de4a8-default-rtdb.firebaseio.com",
  projectId: "crudoperations-de4a8",
  storageBucket: "crudoperations-de4a8.appspot.com",
  messagingSenderId: "257590941105",
  appId: "1:257590941105:web:56862fa69dde5b99cb5990",
  measurementId: "G-3S7VRS3N1W"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth=getAuth();

export {app, auth}


function FirebaseConfig() {
  const firebaseConfig = {
    apiKey: "AIzaSyBKlMSWiYUHxW4VvGy80KjKlfFIqGvOyUA",
    authDomain: "crudoperations-de4a8.firebaseapp.com",
    databaseURL: "https://crudoperations-de4a8-default-rtdb.firebaseio.com",
    projectId: "crudoperations-de4a8",
    storageBucket: "crudoperations-de4a8.appspot.com",
    messagingSenderId: "257590941105",
    appId: "1:257590941105:web:56862fa69dde5b99cb5990",
    measurementId: "G-3S7VRS3N1W",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  return getDatabase(app);
}

export default FirebaseConfig;
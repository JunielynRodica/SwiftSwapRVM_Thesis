import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCh6xajl73ap1DaEDVid2WWnnzHyFaPpHw",
  authDomain: "swiftswaprvm.firebaseapp.com",
  projectId: "swiftswaprvm",
  storageBucket: "swiftswaprvm.appspot.com",
  messagingSenderId: "266884455033",
  appId: "1:266884455033:web:9328eb55822c39795392a8",
  measurementId: "G-LTK8DFYZMT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };

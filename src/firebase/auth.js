import {
  addIncrementTransactionToCurrentUser,
  auth,
  fbfunctions,
  processPendingTransactions,
  SingleTransaction
} from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider, getAuth,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import CryptoJS from 'crypto-js';
import {getFunctions, httpsCallable} from "firebase/functions";
import {startSessionTimeout, stopSessionTimeout} from "../contexts/sessionTimeoutHandler";

// Default: 15 minutes
                              // min * sec * millisec
const sessionTimeoutMS = 15 * 60 * 1000;

export const doCreateUserWithEmailAndPassword = async (email, password, studentNumber) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const fs = getFirestore();
  console.log("CREATING ACCOUNT WITH STUDENT NUMBER " + studentNumber)
  await setDoc(doc(fs, "users/", cred.user.uid), {
    isAdmin: false,
    email: email,
    studentNumber: studentNumber,
    uid: cred.user.uid,
    points: 0,
    transaction_history: []
  });

  // Add transactions for testing
  // TODO: Testing Data
  addIncrementTransactionToCurrentUser(40).then(() => {
    addIncrementTransactionToCurrentUser(50).then(() => {
      addIncrementTransactionToCurrentUser(40).then(() => {
        addIncrementTransactionToCurrentUser(40).then(() => {
          addIncrementTransactionToCurrentUser(20)
        })
      })
    })
  });

  startSessionTimeout(sessionTimeoutMS);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  await processPendingTransactions(cred.user.uid);
  startSessionTimeout(sessionTimeoutMS);
  return { qr_encrypted: getQRCodeData() };
};

export const doSignInWithCustomToken = async (access_token) => {
  const decrypt = await CryptoJS.AES.decrypt(access_token, process.env.REACT_APP_cryptokey).toString(CryptoJS.enc.Utf8);
  const generateToken = httpsCallable(fbfunctions, "generateLoginToken");
  const server_token = await generateToken({ uid: decrypt });

  const cred = await signInWithCustomToken(auth, server_token.data);
  await processPendingTransactions(cred.user.uid);
  startSessionTimeout(sessionTimeoutMS);
  return { qr_encrypted: getQRCodeData() }
};

export const doSignOut = () => {
  stopSessionTimeout();
  return auth.signOut();
};

export const isUserLoggedIn = () => {
  let user = auth.currentUser;
  return user != null;
}

export const isUserAdmin = async () => {
  let user = auth.currentUser;
  console.log("ISUSERADMIN CALLED")
  if (user == null) return false;

  let isadmin = await getDoc(doc(getFirestore(), "users/", user.uid)).then((doc) => { return doc.data().isadmin });
  console.log(isadmin);
  return isadmin;
}

export const getAllUsers = async () => {
  console.log("GETALLUSERS CALLED")
  const getUserUids = httpsCallable(fbfunctions, "getAllUsers");
  const getFirebaseUsers = httpsCallable(fbfunctions, "getFirebaseUser");
  const getUserEmail = httpsCallable(fbfunctions, "getUserEmail");

  const authUids = await getUserUids();
  const users = []

  for (let i = 0; i < authUids.data.length; i++) {
    const firebaseUser = await getFirebaseUsers({ uid: authUids.data[i] });
    const email = await getUserEmail({ uid: authUids.data[i]});
    users.push(JSON.stringify({ email: email, uid: authUids.data[i], firebasedata: firebaseUser.data }));
  }

  console.log(users)
  return users;
}

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/dashboard`,
  });
};

export const getQRCodeData = () => {
  if (!isUserLoggedIn())
    return null;

  const user = auth.currentUser;
  const data_to_encrypt = user.uid;
  const encrypted = CryptoJS.AES.encrypt(data_to_encrypt, process.env.REACT_APP_cryptokey).toString();
  return encrypted;
}
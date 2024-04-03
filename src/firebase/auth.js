import {
  addIncrementTransactionToCurrentUser,
  auth,
  fbfunctions, getUserExistsInFirestore,
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
import {isUserOffline, logoutOfflineUser} from "../contexts/offlineLoginHandler";

// Default: 15 minutes
                              // min * sec * millisec
const sessionTimeoutMS = 15 * 60 * 1000;

export const doCreateUserWithEmailAndPassword = async (email, password, studentNumber) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const fs = getFirestore();
  console.log("CREATING ACCOUNT WITH STUDENT NUMBER " + studentNumber)
  await setDoc(doc(fs, "users/", cred.user.uid), {
    isadmin: false,
    email: email,
    studentNumber: studentNumber,
    uid: cred.user.uid,
    points: 0,
    transaction_history: []
  });

  // Add transactions for testing
  // TODO: Testing Data
  addIncrementTransactionToCurrentUser(1).then(() => {
    addIncrementTransactionToCurrentUser(2).then(() => {
      addIncrementTransactionToCurrentUser(3).then(() => {
        addIncrementTransactionToCurrentUser(2).then(() => {
          addIncrementTransactionToCurrentUser(1)
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
  const uid = decrypt.split('|')[0];
  const validity = decrypt.split('|')[1];

  console.log("QR LOGIN ATTEMPT")

    if (validity < new Date().getTime()) {
      console.log("QR CODE EXPIRED")
      return null;
    }

  const generateToken = httpsCallable(fbfunctions, "generateLoginToken");
  const server_token = await generateToken({ uid: uid });

  const cred = await signInWithCustomToken(auth, server_token.data);
  await processPendingTransactions(cred.user.uid);
  startSessionTimeout(sessionTimeoutMS);
  return { qr_encrypted: getQRCodeData() }
};

export const doOfflineSignInWithQrCode = async (qr_encrypted) => {
    const decrypt = await CryptoJS.AES.decrypt(qr_encrypted, process.env.REACT_APP_cryptokey).toString(CryptoJS.enc.Utf8);
    const uid = decrypt.split('|')[0];
    const validity = decrypt.split('|')[1];

    console.log("OFFLINE QR LOGIN ATTEMPT")

    // Disable validity check for offline login

    /*if (validity < new Date().getTime()) {
        console.log("OFFLINE QR CODE EXPIRED")
        return null;
    }*/


    let doesUserExist = await getUserExistsInFirestore(uid);
    if (!doesUserExist) {
      console.log("USER DOES NOT EXIST IN LOCAL COPY OF FIREBASE DATABASE")
      return null;
    } else {
      console.log("OFFLINE QR CODE LOGIN PASSED")
      startSessionTimeout(sessionTimeoutMS);
      return { qr_encrypted: getQRCodeData(), uid: uid }
    }
};

export const doSignOut = () => {
  stopSessionTimeout();

  if (isUserOffline())
    logoutOfflineUser();
  else
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
  // Don't fetch if we aren't online
  if (!navigator.onLine)
    return null;

  console.log("GETALLUSERS CALLED")
  const getUserUids = httpsCallable(fbfunctions, "getAllUsers");
  const getFirebaseUsers = httpsCallable(fbfunctions, "getFirebaseUser");

  const authUids = await getUserUids();
  const users = []

  for (let i = 0; i < authUids.data.length; i++) {
    const firebaseUser = await getFirebaseUsers({ uid: authUids.data[i] });
    users.push(JSON.stringify({ email: await getUserEmailFromUid(authUids.data[i]), uid: authUids.data[i], firebasedata: firebaseUser.data }));
  }

  console.log(users)
  return users;
};

export const getUserEmailFromUid = async (uid) => {
  const getUserEmail = httpsCallable(fbfunctions, "getUserEmail");
  console.log(uid)
  const email = await getUserEmail({ uid: uid });
  return email.data;
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

  // 2 day validity window
  const validity = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);

  // returns a unix timestamp
  console.log("QR CODE VALIDITY: " + validity.toString());
  const encrypted = CryptoJS.AES.encrypt(data_to_encrypt + '|' + validity.toString(), process.env.REACT_APP_cryptokey).toString();
  return encrypted;
}
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
  collection
} from "firebase/firestore";

import CryptoJS from 'crypto-js';
import {getFunctions, httpsCallable} from "firebase/functions";
import {startSessionTimeout, stopSessionTimeout} from "../contexts/sessionTimeoutHandler";
import {
  getUserStoreSignedIn,
  getUserStoreUid,
  userStoreLogin, userStoreLogout,
} from "../contexts/userStore";
import {getDocs} from "@firebase/firestore";

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
  userStoreLogin(cred.user.uid, email, "");
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  await processPendingTransactions(cred.user.uid);
  startSessionTimeout(sessionTimeoutMS);
  userStoreLogin(cred.user.uid, email, "");
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
  userStoreLogin(cred.user.uid, cred.user.email, "");
  return { qr_encrypted: getQRCodeData() }
};

export const doOfflineSignInWithQrCode = async (qr_encrypted) => {
    const decrypt = await CryptoJS.AES.decrypt(qr_encrypted, process.env.REACT_APP_cryptokey).toString(CryptoJS.enc.Utf8);
    const uid = decrypt.split('|')[0];

    console.log("OFFLINE QR LOGIN ATTEMPT")

    // Disable validity check for offline login

    // const validity = decrypt.split('|')[1];
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
      let user = await getDoc(doc(getFirestore(), "users/", uid)).then((doc) => { return doc.data() });
      userStoreLogin(user.uid, user.email, "");

      startSessionTimeout(sessionTimeoutMS);
      return { qr_encrypted: getQRCodeData() }
    }
};

export const doSignOut = () => {
  stopSessionTimeout();
  userStoreLogout();
  auth.signOut();
  return true;
};

export const isUserLoggedIn = () => {
  return getUserStoreSignedIn();
}

export const isCurrentUserAdmin = async () => {
  if (getUserStoreUid() === "")  {
    // Something has gone wrong, reload the page
    userStoreLogout();
    window.location.reload();
    return false;
  }

  let isadmin = await getDoc(doc(getFirestore(), "users/", getUserStoreUid())).then((doc) => { return doc.data().isadmin });
  console.log("Is current user admin? " + isadmin);
  return isadmin;
}

export const isUserUidAdmin = async (uid) => {
    let isadmin = await getDoc(doc(getFirestore(), "users/", uid)).then((doc) => { return doc.data().isadmin });
    console.log("Is user " + uid + " admin? " + isadmin);
    return isadmin;
}

export const grantAdminStatus = async (uid)=> {
  console.log("Tried to give admin status to " + uid);
    await updateDoc(doc(getFirestore(), "users/", uid), {
        isadmin: true
    });
}

export const revokeAdminStatus = async (uid)=> {
  console.log("Tried to revoke admin status of " + uid);
    await updateDoc(doc(getFirestore(), "users/", uid), {
        isadmin: false
    });
}

export const getAllUsers = async () => {
  console.log("GETALLUSERS CALLED")

  const users = []
  const snapshot = await getDocs(collection(getFirestore(), "users"));

  snapshot.forEach((doc) => {
    users.push(JSON.stringify(doc.data()));
  });

  console.log(users)
  return (users)
};

export const getUserEmailFromUid = async (uid) => {
  await doc(getFirestore(), "users/", uid).get().then((doc) => {
    return doc.data().email;
  });
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

  const data_to_encrypt = getUserStoreUid();

  // 2 day validity window
  const validity = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);

  // returns a unix timestamp
  console.log("QR CODE VALIDITY: " + validity.toString());
  const encrypted = CryptoJS.AES.encrypt(data_to_encrypt + '|' + validity.toString(), process.env.REACT_APP_cryptokey).toString();
  return encrypted;
}
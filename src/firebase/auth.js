import {addIncrementTransactionToCurrentUser, auth, SingleTransaction} from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

export const doCreateUserWithEmailAndPassword = async (email, password, studentNumber) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const fs = getFirestore();
  await setDoc(doc(fs, "users/", cred.user.uid), {
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
  };

export const doSignInWithEmailAndPassword = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // Process pending transactions during login step
  const pending = await getDoc(doc(getFirestore(), "raspberry_pi_esp_32", cred.user.uid));
  if (pending.exists()) {
    const data = pending.data();
    const fs = getFirestore();
    const userRef = doc(fs, "users/", cred.user.uid);
    const userDoc = await getDoc(userRef);
    const user = userDoc.data();

    // Create a new transaction for the pending points
    const transaction = new SingleTransaction(user.transaction_history.length, new Date(), data.points, "Accumulated", "");

    // Update user points and transaction history
    user.transaction_history.push(transaction);

    await updateDoc(userRef, {
      points: user.points + data.points,
      transaction_history: user.transaction_history
    });

    // Delete the pending transaction
    await deleteDoc(pending.ref);
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

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

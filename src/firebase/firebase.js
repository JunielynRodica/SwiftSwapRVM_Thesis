import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFunctions, httpsCallable} from "firebase/functions";
import {deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {getUserEmailFromUid, isUserLoggedIn} from "./auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey || "",
    authDomain: process.env.REACT_APP_authDomain || "",
    projectId: process.env.REACT_APP_projectId || "",
    storageBucket: process.env.REACT_APP_storageBucket || "",
    messagingSenderId: process.env.REACT_APP_messagingSenderId || "",
    appId: process.env.REACT_APP_appId || "",
    measurementId: process.env.REACT_APP_measurementId || "",
    databaseURL: process.env.REACT_APP_databaseURL || "",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fbfunctions = getFunctions(app);

export class SingleTransaction {
    constructor(id = 0, datetime = new Date(), points = 0, type = "accumulated", item = "") {
        this.id = id;
        this.datetime = datetime
        this.points = points;
        this.type = type;
        this.item = item;
    }
}

export { app, auth, fbfunctions };

export const getCurrentUserPoints = async () => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);
    let user = auth.currentUser;

    let _doc = await getDoc(doc(fs, "users/", user.uid));
    if (_doc.exists()) {
        return _doc.data().points;
    }
}

export const getAllTransactions = async () => {
    // Check if we have a network connection to the internet, if not, return null
    if (!navigator.onLine) {
        return null;
    }

    const getTransactions = httpsCallable(fbfunctions, "getAllTransactions");
    console.log("Getting all transactions");

    return await getTransactions().then(async (data) => {
        console.log("After getTransactions")
        console.log(data.data);

        for (let i = 0; i < data.data.length; i++) {
            console.log("Getting data n " + i);
            console.log(data.data[i])
            console.log("Getting email for " + data.data[i].data.uid);

            if (data.data[i].data.uid != null) {
                await getUserEmailFromUid(data.data[i].data.uid).then((email) => {
                    console.log("Email fetched for " + data.data[i].data.uid + " is " + email);
                    data.data[i].data.email = email;
                });
            } else
                data.data[i].data.email = "Could not fetch email";
        }

        console.log("ALL TRANSACTIONS DONE FETCHING")
        return data.data;
    });
}

export const setCurrentUserPoints = async (points) => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);
    let user = auth.currentUser;

    await setDoc(doc(fs, "users/", user.uid), {
        points: await getCurrentUserPoints() + points
    }, { merge: true });
}

export const deductCurrentUserPoints = async (points) => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);
    let user = auth.currentUser;

    await setDoc(doc(fs, "users/", user.uid), {
        points: await getCurrentUserPoints() - points
    }, { merge: true });
}

export const addCurrentUserPoints = async (points) => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);
    let user = auth.currentUser;

    await setDoc(doc(fs, "users/", user.uid), {
        points: await getCurrentUserPoints() + points
    }, { merge: true });
}

export const getCurrentUserTransactions = async () => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);
    let user = auth.currentUser;

    let _doc = await getDoc(doc(fs, "users/", user.uid));
    if (_doc.exists()) {
        return _doc.data().transaction_history.map((data) => {
            return new SingleTransaction(data.id, new Date(data.datetime.toDate()), data.points, data.type, data.item);
        });
    }
}

export const getUserExistsInFirestore = async (uid) => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    let _doc = await getDoc(doc(fs, "users/", uid));
    return _doc.exists();
}

export const getUserDataFromFirestore = async (uid) => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    let _doc = await getDoc(doc(fs, "users/", uid));
    return _doc.data();

}

export const addDeductTransactionToCurrentUser = async (item, points) => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);
    let user = auth.currentUser;

    let transaction = new SingleTransaction(await getCurrentUserTransactions().length, new Date(), points, "redeem", item);
    let currentTransactions = await getCurrentUserTransactions();
    currentTransactions.push(transaction);

    await setDoc(doc(fs, "users/", user.uid), {
        points: await getCurrentUserPoints() - points,
        transaction_history: currentTransactions.map((transaction) => {
            return {
                id: transaction.id,
                datetime: transaction.datetime,
                points: transaction.points,
                type: transaction.type,
                item: transaction.item
            }
        })
    }, { merge: true });
}
export const addIncrementTransactionToCurrentUser = async (points) => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);
    let user = auth.currentUser;

    let transaction = new SingleTransaction(await getCurrentUserTransactions().length, new Date(), points, "accumulated");
    let currentTransactions = await getCurrentUserTransactions();
    currentTransactions.push(transaction)

    await setDoc(doc(fs, "users/", user.uid), {
        points: await getCurrentUserPoints() + points,
        transaction_history: currentTransactions.map((transaction) => {
            return {
                id: transaction.id,
                datetime: transaction.datetime,
                points: transaction.points,
                type: transaction.type,
                item: transaction.item
            }
        })
    }, { merge: true });
}

export const processPendingTransactions = async (uid) => {
    // Check if we have a network connection to the internet, if not, return null
    if (!navigator.onLine) {
        return null;
    }

    if (!isUserLoggedIn())
        return null;

    // Process pending transactions during login step
    const pending = await getDoc(doc(getFirestore(), "raspberry_pi", uid));
    if (pending.exists()) {
        const data = pending.data();
        const fs = getFirestore();
        const userRef = doc(fs, "users/", uid);
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
}

export const _debugFirebaseDisableNetwork = () => {
    const fs = getFirestore(app);
    fs.disableNetwork();
}

export const _debugFirebaseEnableNetwork = () => {
    const fs = getFirestore(app);
    fs.enableNetwork();
}
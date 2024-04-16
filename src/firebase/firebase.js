import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFunctions, httpsCallable} from "firebase/functions";
import {collection, deleteDoc, doc, getDoc, getDocFromCache, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {getUserEmailFromUid, isUserLoggedIn} from "./auth";
import {getUserStoreUid} from "../contexts/userStore";
import {getDocs} from "@firebase/firestore";

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

    let _doc = await getDoc(doc(fs, "users/", getUserStoreUid()));
    if (_doc.exists()) {
        return _doc.data().points;
    }
}

export const getAllTransactions = async () => {

    const snapshot = await getDocs(collection(getFirestore(), "users"));
    let data = [];

    snapshot.forEach((doc) => {
        console.log("Fetching transaction history for " + doc.id + "...");

        if (data.length > 100) {
            console.log("Data limit reached (100), stopping...");
            return;
        }

        data.push({user: doc.data().studentNumber, email: doc.data().email, transactions: doc.data().transaction_history})
    });

    return data;
}

export const setCurrentUserPoints = async (points) => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);

    await setDoc(doc(fs, "users/", getUserStoreUid()), {
        points: await getCurrentUserPoints() + points
    }, { merge: true });
}

export const deductCurrentUserPoints = async (points) => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);

    await setDoc(doc(fs, "users/", getUserStoreUid()), {
        points: await getCurrentUserPoints() - points
    }, { merge: true });
}

export const addCurrentUserPoints = async (points) => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);

    await setDoc(doc(fs, "users/", getUserStoreUid()), {
        points: await getCurrentUserPoints() + points
    }, { merge: true });
}

export const getCurrentUserTransactions = async () => {
    if (!isUserLoggedIn())
        return null;

    let fs = getFirestore(app);

    let _doc = await getDoc(doc(fs, "users/", getUserStoreUid()));
    if (_doc.exists()) {
        return _doc.data().transaction_history.map((data) => {
            return new SingleTransaction(data.id, new Date(data.datetime.toDate()), data.points, data.type, data.item);
        });
    }
}

export const getUserExistsInFirestore = async (uid) => {
    let fs = getFirestore(app);

    try {
        let _doc = await getDocFromCache(doc(fs, "users/", uid));
        return _doc.exists();
    } catch (e) {
        return null;
    }
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

    let transaction = new SingleTransaction(await getCurrentUserTransactions().length, new Date(), points, "redeem", item);
    let currentTransactions = await getCurrentUserTransactions();
    currentTransactions.push(transaction);

    await setDoc(doc(fs, "users/", getUserStoreUid()), {
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

    let transaction = new SingleTransaction(await getCurrentUserTransactions().length, new Date(), points, "accumulated");
    let currentTransactions = await getCurrentUserTransactions();
    currentTransactions.push(transaction)

    await setDoc(doc(fs, "users/", getUserStoreUid()), {
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

export const setStock = async (item, quantity, points, dispense, iconUrl) => {
    let fs = getFirestore(app);

    await setDoc(doc(fs, "stock/", item), {
        name: item,
        quantity: parseInt(quantity),
        points: parseInt(points),
        dispense: parseInt(dispense),
        iconUrl: iconUrl,
    }, { merge: true });
}

export const setStockCount = async (item, quantity) => {
    let fs = getFirestore(app);

    await updateDoc(doc(fs, "stock/", item), {
        quantity: parseInt(quantity)
    });
}

export const setStockIconUrl = async (item, iconUrl) => {
    let fs = getFirestore(app);

    await updateDoc(doc(fs, "stock/", item), {
        iconUrl: iconUrl
    });
}

export const setStockPointsCost = async (item, points) => {
    let fs = getFirestore(app);

    await updateDoc(doc(fs, "stock/", item), {
        points: parseInt(points)
    });
}

export const setStockDispenseAmount = async (item, dispense) => {
    let fs = getFirestore(app);

    await updateDoc(doc(fs, "stock/", item), {
        dispense: parseInt(dispense)
    });
}

export const decrementStock = async (item) => {
    let fs = getFirestore(app);

    let stock = await getFirebaseStock(item);
    console.log("Decrementing stock for " + item);
    if (parseInt(stock.quantity) < parseInt(stock.dispense)) {
        console.log("Not enough stock to dispense " + item + "( " + stock.quantity + " < " + stock.dispense + " )");
        return false;
    }

    await updateDoc(doc(fs, "stock/", item), {
        quantity: parseInt(stock.quantity) - parseInt(stock.dispense)
    });

    return true;
}

export const getFirebaseStock = async (item) => {
    let fs = getFirestore(app);

    let _doc = await getDoc(doc(fs, "stock/", item));
    return _doc.data();
}

export const getStock = async (item) => {
    let fs = getFirestore(app);

    let _doc = await getDoc(doc(fs, "stock/", item));
    return parseInt(_doc.data().quantity);
}

export const removeStock = async (item) => {
    let fs = getFirestore(app);
    await deleteDoc(doc(fs, "stock/", item));
}

export const getAllStock = async () => {
    let fs = getFirestore(app);

    let snapshot = await getDocs(collection(fs, "stock"));
    let data = [];

    snapshot.forEach((doc) => {
        data.push(doc.data());
    });

    return data;
}

export const processPendingTransactions = async (uid) => {
    // Don't process any pending transactions when we're offline
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
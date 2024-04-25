import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFunctions, httpsCallable} from "firebase/functions";
import {collection, deleteDoc, doc, getDoc, getDocFromCache, getFirestore, setDoc, updateDoc, Timestamp} from "firebase/firestore";
import {getUserEmailFromUid, isUserLoggedIn} from "./auth";
import {getUserStoreUid} from "../contexts/userStore";
import {getDocs} from "@firebase/firestore";
import CryptoJS from "crypto-js";
import moment from "moment";

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

export const getTransactionsForUser = async (uid) => {
    let fs = getFirestore(app);

    let _doc = await getDoc(doc(fs, "users/", uid));
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
    // Get all documents in the raspberry_pi collection

    const docs = await getDocs(collection(getFirestore(), "raspberry_pi"));
    if (docs.empty) {
        console.log("No pending transactions found.");
        return;
    } else {
        console.log("Processing pending transactions...");
        for (const _doc of docs.docs) {
            let _data = _doc.data().dateTime;
            console.log(_data)
            let dateTime = moment(_data, "YYYYMMDD HH:mm:ss");
            console.log(dateTime)
            console.log(dateTime.toDate())
            let qr = _doc.data().decrypted_data;
            console.log(qr)
            let points = _doc.data().points;
            console.log(points)

            const decrypt = await CryptoJS.AES.decrypt(qr, process.env.REACT_APP_cryptokey).toString(CryptoJS.enc.Utf8);
            const uid = decrypt.split('|')[0];
            console.log("Processing transaction for " + uid + "...");

            const transaction = new SingleTransaction(0, dateTime.toDate(), points, "accumulated", "");
            const userRef = doc(getFirestore(), "users/", uid);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                console.log("User " + uid + " does not exist.");
                continue;
            }

            const user = userDoc.data();
            const transactions = await getTransactionsForUser(uid);
            transactions.push(transaction);

            console.log("Adding " + points + " points to " + uid + "...");
            await setDoc(userRef, {
                points: user.points + points,
                transaction_history: transactions.map((transaction) => {
                    return {
                        id: transaction.id,
                        datetime: transaction.datetime,
                        points: transaction.points,
                        type: transaction.type,
                        item: transaction.item
                    }
                })
            }, { merge: true });
            // Delete the pending transaction
            console.log("Deleting transaction for " + uid + "...");
            await deleteDoc(_doc.ref);
        }
        return true;
    }
}
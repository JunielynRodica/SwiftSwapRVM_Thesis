import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

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
const auth = getAuth(app)

export class SingleTransaction {
    constructor(id = 0, datetime = new Date(), points = 0, type = "accumulated", item = "") {
        this.id = id;
        this.datetime = datetime
        this.points = points;
        this.type = type;
        this.item = item;
    }
}

export { app, auth };

export const getCurrentUserPoints = async () => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    let _doc = await getDoc(doc(fs, "users/", user.uid));
    if (_doc.exists()) {
        return _doc.data().points;
    }
}

export const setCurrentUserPoints = async (points) => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    await setDoc(doc(fs, "users/", user.uid), {
        points: await getCurrentUserPoints() + points
    });
}

export const deductCurrentUserPoints = async (points) => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    await setDoc(doc(fs, "users/", user.uid), {
        points: await getCurrentUserPoints() - points
    });
}

export const addCurrentUserPoints = async (points) => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    await setDoc(doc(fs, "users/", user.uid), {
        points: await getCurrentUserPoints() + points
    });
}

export const getCurrentUserTransactions = async () => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    let _doc = await getDoc(doc(fs, "users/", user.uid));
    if (_doc.exists()) {
        return _doc.data().transaction_history.map((data) => {
            console.log("TRANSACTION FETCHED")
            console.log(data)
            return new SingleTransaction(data.id, new Date(data.datetime.toDate()), data.points, data.type, data.item);
        });
    }
}

export const addDeductTransactionToCurrentUser = async (item, points) => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    let transaction = new SingleTransaction(await getCurrentUserTransactions().length, new Date(), points, "redeem", item);
    console.log("REDEEMING")
    console.log(transaction)
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
    });
}
export const addIncrementTransactionToCurrentUser = async (points) => {
    let fs = getFirestore(app);
    let user = auth.currentUser;

    let transaction = new SingleTransaction(await getCurrentUserTransactions().length, new Date(), points, "accumulated");
    console.log("INCREMENT TRANSACTION")
    console.log(transaction)
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
    });
}


import React from "react";
import { AuthProvider, useAuth } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

import Login from "./components/auth/login";
import Register from "./components/auth/register";
import ForgotPassword from "./components/auth/forgotpassword";

import Dashboard from "./components/pages/dashboard";
import Rewards from "./components/pages/rewards";
import About from "./components/pages/about";
import TransactionHistory from "./components/pages/TransactionHistory";

import './App.css';
import { FaDashcube } from "react-icons/fa";
import {connectAuthEmulator, getAuth} from "firebase/auth";
import {
    connectFirestoreEmulator, doc,
    getDocs,
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    getPersistentCacheIndexManager,
    collection,
    enableNetwork,
    disableNetwork
} from "firebase/firestore";
import {connectFunctionsEmulator, getFunctions} from "firebase/functions";
import {app, SingleTransaction} from "./firebase/firebase";
import Admin from "./components/admin/admin";
import Accounts from "./components/admin/accounts";
import Transactions from "./components/admin/transactions";
import {doCreateUserWithEmailAndPassword} from "./firebase/auth";

let initOnce = false;

function App() {

    if (process.env.REACT_APP_EMULATED === "true") {
        if (!initOnce) {
            getAuth(app);
            connectAuthEmulator(getAuth(app), "http://127.0.0.1:9099",);
            connectFirestoreEmulator(getFirestore(app), "localhost", 8080);
            connectFunctionsEmulator(getFunctions(app), "localhost", 5001);
            doCreateUserWithEmailAndPassword("admin@gmail.com", "password", 1234);
            initOnce = true;
        }
    } else {
        if (!initOnce) {
            initializeFirestore(app, {localCache: persistentLocalCache()});
            let fs = getFirestore(app);

            if (navigator.onLine === false) {
                disableNetwork(fs).then(() => {
                    console.log("Firebase: Network disabled");
                });
            }

            window.addEventListener("online", () => {
                console.log("Browser is now online");
                enableNetwork(fs).then(() => {
                    console.log("Firebase: Network enabled");
                });
            }, false);

            window.addEventListener("offline", () => {
                console.log("Browser is now offline");
                disableNetwork(fs).then(() => {
                    console.log("Firebase: Network disabled");
                });
            });

            // Get all documents in the root collection in Firebase to store them in the cache
            getDocs(collection(fs, "users")).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(querySnapshot.metadata.fromCache ? "FROM CACHE" : "NOT FROM CACHE")
                    console.log(doc.id, " => ", doc.data());
                });
            });
            initOnce = true;
        }
    }

    const routesArray = [
        {
            path: "*",
            element: <Login />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/forgotPassword",
            element: <ForgotPassword />,
        },
        {
            path: "/dashboard",
            element: <Dashboard />,
        },
        {
            path: "/rewards",
            element: <Rewards />,
        },
        {
            path: "/transactionHistory",
            element: <TransactionHistory />,
        },
        {
            path: "/about",
            element: <About />,
        },
        {
            path: "/admin",
            element: <Admin />
        },
        {
            path: "/admin/accounts",
            element: <Accounts />,
        },
        {
            path: "/admin/transactions",
            element: <Transactions />,
        },
    ];
    let routesElement = useRoutes(routesArray);
    return (
        <AuthProvider>
            <div>{routesElement}</div>
        </AuthProvider>
    );
}

export default App;

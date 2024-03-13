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
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {connectFunctionsEmulator, getFunctions} from "firebase/functions";
import {app} from "./firebase/firebase";

let initOnce = false;

function App() {

    if (process.env.REACT_APP_EMULATED === "true") {
        if (!initOnce) {
            getAuth(app);
            connectAuthEmulator(getAuth(app), "http://127.0.0.1:9099",);
            connectFirestoreEmulator(getFirestore(app), "localhost", 8080);
            connectFunctionsEmulator(getFunctions(app), "localhost", 5001);
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
    ];
    let routesElement = useRoutes(routesArray);
    return (
        <AuthProvider>
            <div>{routesElement}</div>
        </AuthProvider>
    );
}

export default App;

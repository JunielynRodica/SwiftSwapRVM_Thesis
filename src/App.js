import React from "react";
import { AuthProvider, useAuth } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Dashboard from "./components/pages/dashboard";
import Rewards from "./components/pages/rewards";
import About from "./components/pages/about";
import TransactionHistory from "./components/pages/TransactionHistory";

import './App.css';
import { FaDashcube } from "react-icons/fa";

function App() {

    const routesArray = [
        {
            path: "*",
            element: <Login/>,
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

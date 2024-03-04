import React from 'react';
import Sidebar from "../sidebar";
import { Route, Routes } from "react-router-dom";
import Rewards from "../pages/rewards";
import About from "../pages/about";
import Dashboard from "../pages/dashboard";
import TransactionHistory from "../pages/TransactionHistory";

const Home = () => {
    return (
        <Sidebar>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/TransactionHistory" element={<TransactionHistory />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Sidebar>
    );
}

export default Home;

import React from "react";
import Sidebar from "./components/sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rewards from "./pages/rewards";
import About from "./pages/about";
import TransactionHistory from "./pages/TransactionHistory";
import './App.css';
import Dashboard from "./pages/dashboard";

const App = () => {
    return(
       <BrowserRouter>
              <Sidebar>
                    <Routes>
                        <Route path="/"element={<Dashboard/>}/>
                        <Route path="/dashboard"element={<Dashboard/>}/>
                        <Route path="/rewards"element={<Rewards/>}/>
                        <Route path="/TransactionHistory"element={<TransactionHistory/>}/>
                        <Route path="/about"element={<About/>}/>
                    </Routes>
                </Sidebar>
       </BrowserRouter>
    );
};

export default App;
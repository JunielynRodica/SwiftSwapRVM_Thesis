import React, { useState } from "react";
import {
    FaBars,
    FaClipboard,
    FaPen,
    FaReceipt,
    FaUsers,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from 'react-router-dom'
import rvmpic from '../assets/rvmpic.png';
import { useAuth } from "../contexts/authContext";

import { doSignOut } from '../firebase/auth'

const Sidebar = ({ children }) => {

    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const menuItem = [
        {
            path: '/dashboard',
            name: 'Dashboard',
            icon: <FaClipboard />,
        },
        {
            path: '/rewards',
            name: 'Rewards',
            icon: <FaPen />,
        },
        {
            path: '/transactionHistory',
            name: 'Transaction History',
            icon: <FaReceipt />,
        },
        {
            path: '/about',
            name: 'About',
            icon: <FaUsers />,
        },
    ];

    // Filter out "Signin" and "Signup" items
    const filteredMenuItems = menuItem.filter(item => item.path !== '/signin' && item.path !== '/signup');

    return (
        <div className="container_sidebar">
            <div style={{ width: isOpen ? "250px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <img src={rvmpic} alt="logo" style={{ display: isOpen ? "block" : "none" }} className="logo"></img>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {filteredMenuItems.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link" activeClassName="active">
                        <div className="icon">{item.icon}</div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                    </NavLink>
                ))}
                {/* <div>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div> */}
                {
                    currentUser
                        ?
                        <>
                            <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-blue-600 underline'>Logout</button>
                        </>
                        :
                        <>
                            <Link to={'/login'}>Login</Link>
                            <Link to={'/register'}>Register New Account</Link>
                        </>
                }
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;

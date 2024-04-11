import React, {useEffect, useState} from "react";
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
import {doSignOut, isCurrentUserAdmin} from '../firebase/auth'
import {FaGear} from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import {getUserStoreSignedIn, userStoreLogout} from "../contexts/userStore";

const Sidebar = ({ children }) => {

    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(false);

    useEffect(() => {
        async function getIsUserAdmin() {
            await isCurrentUserAdmin().then((result) => {
                if (result) {
                    setAdminUser(true);
                }
            })
        }

        getIsUserAdmin();
    }, []);

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
        {
            path: '/admin',
            name: 'Admin',
            icon: <FaGear />,
        },
        // {
        //     path: '/login',
        //     name: 'Logout',
        //     icon: <FaSignOutAlt />,
        // },
    ];

    // Filter out "Signin" and "Signup" items
    const filteredMenuItems = menuItem.filter(item => item.path !== '/signin' && item.path !== '/signup');

    // Filter the admin page if the user is not an admin
    if (!adminUser) {
        filteredMenuItems.pop();
    }

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
                <NavLink className="link" onClick={() => {
                    doSignOut().then(() => {
                        userStoreLogout()
                        navigate('/login')
                    })
                }}>
                    <FaSignOutAlt className="icon"/>
                    <div style={{ display: isOpen ? "block" : "none" }} className="link_text">Logout</div>
                </NavLink>
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;

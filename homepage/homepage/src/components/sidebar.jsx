import React, {useState} from "react";
import {
    FaBars,
    FaClipboard,
    FaPen,
    FaReceipt,
    FaUsers,
    
}from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = ({children}) =>{
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:'/',
            name:'Dashboard',
            icon:<FaClipboard/>
        },
        {
            path:'/rewards',
            name:'Rewards',
            icon:<FaPen/>
        },
        {
            path:'/transactionHistory',
            name:'Transaction History',
            icon:<FaReceipt/>
        },
        {
            path:'/about',
            name:'About',
            icon:<FaUsers/>
        },
    ]
    return (
        <div className="container_sidebar">
            <div style={{width: isOpen ? "250px" : "50px"}} className="sidebar">
                <div className="top_section">
                    <img src="http://tinyurl.com/58djnbxb" alt="logo" style={{display: isOpen ? "block" : "none"}} className="logo"></img>
                    <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                        <FaBars onClick={toggle}/>
                    </div>
                </div>
                {
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className="link"
                        activeClassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <main>{children}</main>
        </div>  
    );
};

export default Sidebar;
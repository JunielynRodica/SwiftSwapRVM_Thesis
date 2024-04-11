import React, {useEffect, useState} from "react";
import registered_users from '../../assets/registered_user.png';
import rvmpic from '../../assets/rvmpic.png';
import user_transaction from '../../assets/user_transaction.png';
import { useNavigate } from 'react-router-dom';
import {
    deleteUserUid,
    getAllUsers,
    grantAdminStatus,
    isCurrentUserAdmin,
    isUserLoggedIn,
    isUserUidAdmin,
    revokeAdminStatus
} from '../../firebase/auth';
import '../../style/accounts.css';

const Accounts = () => {

const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate('/login')
        }

        if (!isCurrentUserAdmin()) {
            navigate('/dashboard')
        }

        async function populateData() {
            let data = await getAllUsers();
            console.log(data);
            setAccounts(data);
        }

        populateData();
    }, []);

    function toggleAdmin(uid) {
        isUserUidAdmin(uid).then((result) => {
            if (result) {
                revokeAdminStatus(uid);
            } else {
                grantAdminStatus(uid);
            }
        });
    }

    return (
        <div className="admin_body">
        <div className="header_admin">
          <img src={rvmpic} alt="logo" />
          <h1>S W I F T S W A P | A C C O U N T S </h1>
        </div>

    <section id="admin_feature">

        <div className="user-table-container">
           <h2>User Logs</h2>
           <div className="user-table-wrapper">
             <table className="user-table">
               <thead>
             <tr>
                   <th>Employee/ Student Number</th>
                   <th>Points</th>
                   <th>Email</th>
                   <th>User ID</th>
                   <th>Admin</th>
                   <th colSpan="2">Actions</th>
                 </tr>
           </thead>
                 <tbody>
                 {accounts.length > 0 ? accounts.map((account) => {
                     account = JSON.parse(account);
                     console.log(account)
                        return (
                            <tr>
                                <td>{account.studentNumber}</td>
                                <td>{account.points}</td>
                                <td>{account.email}</td>
                                <td>{account.uid.substring(0, 8) + "..."}</td>
                                <td id={"admin_" + account.uid}>{account.isadmin ? "Yes" : "No"}</td>
                                <td><button onClick={ () => {
                                    toggleAdmin(account.uid);
                                    let admin_uid = "admin_" + account.uid;
                                    let toggle_uid = "toggle_" + account.uid;
                                    let admin_status = document.getElementById(admin_uid).innerHTML;
                                    let toggle_button = document.getElementById(toggle_uid);
                                    document.getElementById(admin_uid).innerHTML = admin_status === "Yes" ? "No" : "Yes";
                                    toggle_button.innerHTML = admin_status === "Yes" ? "Make Admin" : "Revoke Admin";
                                } } id={"toggle_" + account.uid}>{account.isadmin ? "Revoke Admin" : "Make Admin"}</button></td>
                                <td><button onClick={() => {
                                    console.log("Delete user " + account.uid);
                                    if (!navigator.onLine)                                    {
                                        alert("You are offline. Please connect to the internet to delete a user.");
                                        return;
                                    }
                                    if (window.confirm("Are you sure you want to delete this user?")) {
                                        console.log("Deleting user " + account.uid);
                                        deleteUserUid(account.uid);
                                    }
                                }}>Close Account</button></td>
                            </tr>
                        )
                 }) : <tr><td colSpan="6">Data is loading, please wait...</td></tr> }
                 </tbody>
             </table>
           </div>
         </div>


    </section>
        </div>


        // <div className="transaction-table-container">
        //   <h2>Transaction Histories</h2>
        //   <div className="transaction-table-wrapper">
        //     <table className="transaction-table">
        //       <thead>
        //         <tr>
        //           <th>User</th>
        //           <th>Date</th>
        //           <th>Time</th>
        //           <th>Action</th>
        //           <th>Points</th>
        //           <th>Item Redeemed</th>
        //         </tr>
        //       </thead>
        //       <tbody>
        //           { hasData ? output : <tr><td colSpan="5">No transaction history available</td></tr> }
        //       </tbody>
        //     </table>
        //   </div>
        // </div>
      );
    };

    export default Accounts;
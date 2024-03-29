import React, {useEffect, useState} from "react";
import registered_users from '../../assets/registered_user.png';
import rvmpic from '../../assets/rvmpic.png';
import user_transaction from '../../assets/user_transaction.png';
import { useNavigate } from 'react-router-dom';
import {getAllUsers, isUserAdmin, isUserLoggedIn} from '../../firebase/auth';
import '../../style/accounts.css';

const Accounts = () => {

const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate('/login')
        }

        if (!isUserAdmin()) {
            navigate('/dashboard')
        }

        async function populateData() {
            let data = await getAllUsers();
            console.log(data);
            setAccounts(data);
        }

        populateData();
    }, []);

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
                 </tr>
           </thead>
                 <tbody>
                 {accounts.length > 0 ? accounts.map((account) => {
                     account = JSON.parse(account);
                        return (
                            <tr>
                                <td>{account.firebasedata.studentNumber}</td>
                                <td>{account.firebasedata.points}</td>
                                <td>{account.email}</td>
                                <td>{account.uid.substring(4, 8) + "..."}</td>
                            </tr>
                        )
                 }) : <tr><td colSpan="4">Data is loading, please wait...</td></tr> }
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
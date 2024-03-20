import React, {useEffect} from "react";
import registered_users from '../../assets/registered_user.png';
import rvmpic from '../../assets/rvmpic.png';
import user_transaction from '../../assets/user_transaction.png';
import { useNavigate } from 'react-router-dom';
import {isUserAdmin, isUserLoggedIn} from '../../firebase/auth';

const Transactions = () => {

const navigate = useNavigate();

    useEffect(() => {
        isUserLoggedIn().then((logInResult) => {

            if (!logInResult) {
                navigate('/login');
            }

            isUserAdmin().then((adminResult) => {
                if (!adminResult) {
                    navigate('/dashboard');
                }
            })
        });
    }, []);

    return (
        <div className="admin_body">
        <div className="admin_rewards">
          <img src={rvmpic} alt="logo" />
          <h1>S W I F T S W A P | A D M I N </h1>
        </div>
 
    <section id="admin_feature">
            <div className="access">
            <img src={registered_users} alt=""/>
            <button className="user-access-btn" onClick={handleAdminAccess}>Access</button>
              </div>
    
            <div className="access">
            <img src={user_transaction} alt=""/>
            <button className="user-transac-btn" onClick={handleAdminAccess}>Access</button>
              </div>
          </section>
        </div>
       
     // <div className="user-table-container">
        //   <h2>User Logs</h2>
        //   <div className="user-table-wrapper">
        //     <table className="user-table">
        //       <thead>
        //         <tr>
        //           <th>Employee/ Student Number</th>
        //           <th>Email</th>
        //           <th>User ID</th>        
        //         </tr>
        //       </thead>
        //     </table>
        //   </div>
        // </div>

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

    export default Transactions;
import React, {useEffect} from "react";
import registered_users from '../../assets/registered_user.png';
import rvmpic from '../../assets/rvmpic.png';
import user_transaction from '../../assets/user_transaction.png';
import {NavLink, useNavigate} from 'react-router-dom';
import {isUserAdmin, isUserLoggedIn} from '../../firebase/auth';
import "../../style/admin.css";

const Admin = () => {

const navigate = useNavigate();

    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate('/login');
        }

        if (!isUserAdmin()) {
            navigate('/dashboard');
        }
    }, []);

    return (
        <div className="admin_body">
            <div className="header_admin">
                <img src={rvmpic} alt="logo" />
                <h1>S W I F T S W A P | A D M I N </h1>
            </div>
 
        <section id="admin_feature">
            <div className="access">
                <NavLink to={"/admin/accounts"}>
                    <img src={registered_users} alt=""/>
                </NavLink>
            </div>

            <div className="access">
                <NavLink to={"/admin/transactions"}>
                    <img src={user_transaction} alt=""/>
                </NavLink>
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

    export default Admin;
import React, {useEffect, useState} from "react";
import registered_users from '../../assets/registered_user.png';
import rvmpic from '../../assets/rvmpic.png';
import user_transaction from '../../assets/user_transaction.png';
import { useNavigate } from 'react-router-dom';
import {isUserAdmin, isUserLoggedIn} from '../../firebase/auth';
import {getAllTransactions} from "../../firebase/firebase";

const Transactions = () => {

const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);


    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate('/login')
        }

        if (!isUserAdmin()) {
            navigate('/dashboard')
        }

        async function populateData() {
            console.log("Populating transaction data")
            let data = await getAllTransactions();
            console.log(data[0]);
            setTransactions(data[0]);
        }
        
        populateData();
    }, []);

    return (
        <div className="admin_body">
        <div className="admin_rewards">
          <img src={rvmpic} alt="logo" />
          <h1>S W I F T S W A P | A D M I N </h1>
        </div>

            <section id="admin_feature">


                <div className="transaction-table-container">
                    <h2>Transaction Histories</h2>
                    <div className="transaction-table-wrapper">
                        <table className="transaction-table">
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Time</th>
                                <th>Type</th>
                                <th>Action</th>
                                <th>Points</th>
                                <th>Item Redeemed</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.length > 0 ? transactions.map((transaction) => {
                                console.log("PARSING TRANSACTION")
                                console.log(transaction)
                                return (
                                    <tr>
                                        <td>{transaction.user}</td>
                                        <td>{transaction.date}</td>
                                        <td>{transaction.type}</td>
                                        <td>{transaction.action}</td>
                                        <td>{transaction.points}</td>
                                        <td>{transaction.item}</td>
                                    </tr>
                                )
                            }) : <tr>
                                <td colSpan="5">No transaction history available</td>
                            </tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default Transactions;
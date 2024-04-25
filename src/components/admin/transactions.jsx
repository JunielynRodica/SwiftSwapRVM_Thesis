import React, {useEffect, useState} from "react";
import registered_users from '../../assets/registered_user.png';
import rvmpic from '../../assets/rvmpic.png';
import user_transaction from '../../assets/user_transaction.png';
import { useNavigate } from 'react-router-dom';
import {getUserEmailFromUid, isCurrentUserAdmin, isUserLoggedIn} from '../../firebase/auth';
import {getAllTransactions} from "../../firebase/firebase";
import '../../style/transactions.css';
const Transactions = () => {

const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);


    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate('/login')
        }

        if (!isCurrentUserAdmin()) {
            navigate('/dashboard')
        }

        async function populateData() {
            let data = await getAllTransactions();
            let flat = data.map((user) => {
                return user.transactions.map((transaction) => {
                    return {
                        user: user.user,
                        email: user.email,
                        datetime: transaction.datetime,
                        type: transaction.type,
                        points: transaction.points,
                        item: transaction.item
                    }
                });
            }).flat(1).sort((a,b) => {
                return b.datetime - a.datetime;
            });
            setTransactions(flat);
        }

        populateData();
    }, []);

    return (
        <div className="admin_body">
        <div className="header_admin">
          <img src={rvmpic} alt="logo" />
          <h1>S W I F T S W A P | T R A N S A C T I O N S </h1>
        </div>

            <section id="admin_feature">

                <div className="transactions-table-container">
                    <h2>User Transaction Histories</h2>
                    <div className="transactions-table-wrapper">
                        <table className="transactions-table">
                            <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Email</th>
                                <th>Time</th>
                                <th>Type</th>
                                <th>Points</th>
                                <th>Item Redeemed</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.length > 0 ? transactions.map((transaction) => {
                                return (
                                    <tr>
                                        <td>{transaction.user}</td>
                                        <td>{transaction.email}</td>
                                        <td>{new Date(transaction.datetime.seconds * 1000 + transaction.datetime.nanoseconds / 100000).toLocaleString()}</td>
                                        <td>{transaction.type}</td>
                                        <td>{transaction.points}</td>
                                        <td>{transaction.item}</td>
                                    </tr>
                                );
                            }) : <tr>
                                <td colSpan="6">No transaction history available</td>
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
import React, {useEffect, useState} from "react";
import '../../style/TransactionHistory.css';
import {
    getCurrentUserTransactions,
    SingleTransaction
} from '../../firebase/firebase';
import {useNavigate} from "react-router-dom";
import {isUserLoggedIn} from "../../firebase/auth";

const TransactionHistory = () => {
    // { id: 1, date: '2024-02-27', time: '10:00', points: 50, type: 'accumulated', item: null },
    const [transactions, setTransactions] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [output, setOutput] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        let internal_has_data = false;

        if (!isUserLoggedIn())
            nav('/login')

        const fetchData = async () => {
            await getCurrentUserTransactions().then((data) => {
                if (data && data.length > 0) {
                    setHasData(true);
                    internal_has_data = true;
                    data.map((data) => {
                        transactions.push(new SingleTransaction(data.id, new Date(data.datetime), data.points, data.type, data.item));
                    });
                }
            }).then(() => {
                if (internal_has_data) {
                    let _outputHtml = transactions.map((transaction) => {
                        return (
                            <tr key={transaction.id}>
                                <td>{transaction.datetime.getFullYear() + "-" + (transaction.datetime.getMonth() + 1) + "-" + transaction.datetime.getDate() + " "}</td>
                                <td>{transaction.datetime.getHours() + ":" + transaction.datetime.getMinutes()}</td>
                                <td>{transaction.type === 'accumulated' ? 'Points Accumulated' : 'Points Redeemed'}</td>
                                <td>{transaction.points}</td>
                                <td>{transaction.item ? transaction.item : '-'}</td>
                            </tr>
                        );
                    });
                    setOutput(_outputHtml);
                }
            });
        }

        fetchData();
    }, []);

    return (
      <div className="transaction-table-container">
        <h2>Transaction History</h2>
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
                <th>Points</th>
                <th>Item Redeemed</th>
              </tr>
            </thead>
            <tbody>
                { hasData ? output : <tr><td colSpan="5">No transaction history available</td></tr> }
                <td colSpan="3">Current Point Total</td>
            <td>{transactions.reduce((acc, transaction) => {
                if (transaction.type === 'accumulated') {
                    return acc + transaction.points;
                } else {
                    return acc - transaction.points;
                }}, 0)}</td>
            <td></td>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

export default TransactionHistory;
import React, {useState} from "react";
import '../../style/TransactionHistory.css';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([
      { id: 1, date: '2024-02-27', time: '10:00', points: 50, type: 'accumulated', item: null },
      { id: 2, date: '2024-02-28', time: '12:00', points: 20, type: 'redeemed', item: 'Ballpen' },
      { id: 3, date: '2024-02-28', time: '12:00', points: 10, type: 'redeemed', item: 'Paper' },
      { id: 4, date: '2024-02-29', time: '10:00', points: 50, type: 'accumulated', item: null },
      { id: 5, date: '2024-03-01', time: '12:00', points: 20, type: 'redeemed', item: 'Sticky Note' },
      { id: 6, date: '2024-03-02', time: '13:00', points: 10, type: 'accumulated', item: null },
      { id: 7, date: '2024-03-03', time: '15:00', points: 20, type: 'redeemed', item: 'Sticky Note' },
      { id: 8, date: '2024-03-04', time: '11:00', points: 10, type: 'accumulated', item: null },
      { id: 9, date: '2024-03-05', time: '15:00', points: 30, type: 'redeemed', item: 'Correction Tape' },
      { id: 10, date: '2024-03-06', time: '08:00', points: 10, type: 'redeemed', item: 'Paper Clip' },
      // more transactions
    ]);
    const updateTransactions = (newTransactions) => {
      setTransactions(newTransactions);
    };
    
  
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
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.time}</td>
                  <td>{transaction.type === 'accumulated' ? 'Points Accumulated' : 'Points Redeemed'}</td>
                  <td>{transaction.points}</td>
                  <td>{transaction.item ? transaction.item : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

export default TransactionHistory;
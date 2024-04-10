import React, {useEffect, useState} from "react";
import registered_users from '../../assets/registered_user.png';
import rvmpic from '../../assets/rvmpic.png';
import user_transaction from '../../assets/user_transaction.png';
import { useNavigate } from 'react-router-dom';
import {
    getAllUsers,
    grantAdminStatus,
    isCurrentUserAdmin,
    isUserLoggedIn,
    isUserUidAdmin,
    revokeAdminStatus
} from '../../firebase/auth';
import '../../style/admin.css';
import {
    setStock,
    getAllStock,
    removeStock,
    setStockIconUrl,
    setStockPointsCost,
    setStockDispenseAmount, setStockCount
} from "../../firebase/firebase";
import {getElementError} from "@testing-library/react";

const Stock = () => {

const navigate = useNavigate();

    const [stockData, setStockData] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate('/login')
        }

        if (!isCurrentUserAdmin()) {
            navigate('/dashboard')
        }

        async function populateData() {
            let data = await getAllStock();
            console.log(data);
            setStockData(data);
        }

        populateData();
    }, [update]);


    return (
        <div className="admin_body">
        <div className="header_admin">
          <img src={rvmpic} alt="logo" />
          <h1>S W I F T S W A P | S T O C K </h1>
        </div>

    <section id="admin_feature">
        <div className="user-table-container">
           <h2>Stock</h2>
           <div className="user-table-wrapper">
             <table className="user-table">
               <thead>
             <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Points Cost</th>
                  <th>Dispense Amount</th>
                  <th>Icon Name</th>
                  <th>Action</th>
                 </tr>
           </thead>
                 <tbody id="stockTable">
                 {stockData.length > 0 ? stockData.map((item) => {
                     let itemNameHtml = item.name.replace(" ", "_");
                        return (
                            <tr id={"tr_" + itemNameHtml}>
                                <td>{item.name}</td>
                                <td><input
                                    type="number"
                                    id={"input_" + itemNameHtml}
                                    min="0"
                                    defaultValue={item.quantity}
                                    onChange={(e) => {
                                        setStockCount(item.name, e.target.value);
                                        setUpdate(!update);
                                    }}/></td>
                                <td><input type="number"
                                           id={"points_" + itemNameHtml}
                                           min="0"
                                           defaultValue={item.points}
                                           onChange={(e) => {
                                               setStockPointsCost(item.name, e.target.value);
                                               setUpdate(!update);
                                           }}/></td>
                                <td><input
                                    type="number" id={"dispense_" + itemNameHtml}
                                    min="0"
                                    defaultValue={item.dispense}
                                    onChange={(e) => {
                                    setStockDispenseAmount(item.name, e.target.value);
                                    setUpdate(!update);
                                }}/></td>
                                <td><input type="text"
                                             defaultValue={item.iconUrl}
                                           id={"icon_" + itemNameHtml}
                                           onChange={(e) => {
                                    setStockIconUrl(item.name, e.target.value);
                                    setUpdate(!update);
                                }}/></td>
                                <td>
                                    <button onClick={() => {
                                        removeStock(item.name);
                                        setUpdate(!update);
                                    }}>Remove Item
                                    </button>
                                </td>
                            </tr>
                        )
                 }) : <tr>
                     <td colSpan="7">Loading data, please wait...</td>
                 </tr>}
                 {stockData.length > 0 ? <tr>
                     <td colSpan="7">Add more items below</td>
                 </tr> : <tr>
                     <td colSpan="7">No stock available</td>
                 </tr>}
                 <tr>
                     <td><input type="text" id="newItem" placeholder="Item"/></td>
                     <td><input type="number" id="newQuantity" placeholder="Quantity"/></td>
                     <td><input type="number" id="newPoints" placeholder="Points Cost"/></td>
                     <td><input type="number" id="newDispense" placeholder="Dispense Amount"/></td>
                     <td><input type="text" id="newIcon" placeholder="Icon URL"/></td>
                     <td><button onClick={() => {
                         let itemName = document.getElementById("newItem").value;
                         let itemQuantity = document.getElementById("newQuantity").value;
                            let itemPoints = document.getElementById("newPoints").value;
                            let itemDispense = document.getElementById("newDispense").value;
                            let itemIcon = document.getElementById("newIcon").value;

                            if (itemName === "" || itemQuantity === "" || itemPoints === "" || itemDispense === "" || itemIcon === "") {
                                alert("Please fill in all fields");
                                return;
                            }

                         setStock(itemName, itemQuantity, itemPoints, itemDispense, itemIcon);
                         document.getElementById("newItem").value = "";
                         document.getElementById("newQuantity").value = "";
                            document.getElementById("newPoints").value = "";
                            document.getElementById("newDispense").value = "";
                            document.getElementById("newIcon").value = "";
                         setUpdate(!update);
                     }}>Add Item</button></td>
                 </tr>
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

export default Stock;
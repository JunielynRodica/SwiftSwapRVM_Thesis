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
import {addStock, getAllStock, removeStock} from "../../firebase/firebase";

const Stock = () => {

const navigate = useNavigate();

    const [stock, setStock] = useState([]);
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
            setStock(data);
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
                  <th>Set Stock</th>
                  <th>Action</th>
                 </tr>
           </thead>
                 <tbody id="stockTable">
                 {stock.length > 0 ? stock.map((item) => {
                     let itemNameHtml = item.name.replace(" ", "_");
                        return (
                            <tr id={"tr_" + itemNameHtml}>
                                <td>{item.name}</td>
                                <td id={"quantity_" + itemNameHtml}>{item.quantity}</td>
                                <td><input
                                    type="number"
                                    id={"input_" + itemNameHtml}
                                    min="0"
                                    defaultValue={item.quantity}
                                    onChange={(e) => {
                                        console.log("changing " + itemNameHtml + " to " + e.target.value);
                                        addStock(item.name, e.target.value);
                                        document.getElementById("quantity_" + itemNameHtml).innerHTML = e.target.value;
                                    }
                                    }/></td>
                                <td><button onClick={() => {
                                    removeStock(item.name);
                                    document.getElementById("tr_" + itemNameHtml).remove();
                                }}>Remove Item</button></td>
                            </tr>
                        )
                 }) : <tr><td colSpan="3">Loading data, please wait...</td></tr> }
                 {stock.length > 0 ? <tr><td colSpan="4">Add more items below</td></tr> : <tr><td colSpan="4">No stock available</td></tr>}
                 <tr>
                     <td><input type="text" id="item" placeholder="Item"/></td>
                     <td><input type="number" id="quantity" placeholder="Quantity"/></td>
                     <td/>
                     <td><button onClick={() => {
                         addStock(document.getElementById("item").value, document.getElementById("quantity").value);
                         document.getElementById("item").value = "";
                         document.getElementById("quantity").value = "";
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
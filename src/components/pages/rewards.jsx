import React, {useEffect, useState} from "react";
import "../../style/rewards.css";
import rvmpic from '../../assets/rvmpic.png';
import {
    addDeductTransactionToCurrentUser, getAllStock,
    getCurrentUserPoints, getStock,
} from "../../firebase/firebase";
import {isUserLoggedIn} from "../../firebase/auth";
import {useNavigate} from "react-router-dom";

const Rewards = () => {
    const [points, setPoints] = useState(0);
    const [rewards, setRewards] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        if (!isUserLoggedIn())
            nav('/login')

        const fetchData = async () => {
            setPoints(await getCurrentUserPoints());
            setRewards(await getAllStock());
        }

        fetchData();
    }, []);

    const handleRedeem = (productName, requiredPoints) => {
      const confirmed = window.confirm(`Are you sure you want to redeem ${productName}?`);
      if (confirmed) {
          console.log(`Attempting to redeem ${productName}...`);
          // Check if we have enough points
          if (points >= requiredPoints) {
              // Check if we have enough stock
              getStock(productName).then((stock) => {
                  if (stock <= 0) {
                      alert("Stock insufficient! You cannot redeem this product.");
                  } else {
                      setPoints(points - requiredPoints); // Update points after redemption
                      addDeductTransactionToCurrentUser(productName, requiredPoints); // Add transaction to user account
                      alert(`Redeeming ${productName}`);
                  }
              });
          } else {
              alert("Points insufficient! You cannot redeem this product.");
          }
      }
  };
  
    return (
        <div className="rewards_body">
            <div className="header_rewards">
                <img src={rvmpic} alt="logo"/>
                <h1>S W I F T S W A P | R E W A R D S <br/>
                    Your Total SwiftSwap Points is: {points} points
                </h1>
            </div>
            {rewards.length === 0 ? <h2 style={{textAlign: "center", paddingTop: "20px"}}>Loading rewards, please wait...</h2> : null}
            <section id="features">
                {rewards.map((reward) => {
                    return (
                        <div className="product">
                            <img src={reward.iconUrl} alt=""/>
                            <h3>{reward.name}</h3>
                            <p>You need to accumulate <br/><b>{reward.points} points </b>  to get <b>{reward.dispense} {reward.dispense > 1 ? reward.name + 's' : reward.name}</b></p>
                            <button className={points < reward.points ? "redeem-btn disabled" : "redeem-btn"}
                                    onClick={() => handleRedeem(reward.name, reward.points)}
                                    disabled={points < reward.points || parseInt(reward.dispense) <= 0 }>Redeem</button>
                        </div>
                    )
                })}
            </section>
        </div>
    )};
export default Rewards;
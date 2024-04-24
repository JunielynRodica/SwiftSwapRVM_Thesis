import React, {useEffect, useState} from "react";
import "../../style/rewards.css";
import rvmpic from '../../assets/rvmpic.png';
import {
    addDeductTransactionToCurrentUser, decrementStock, deductCurrentUserPoints, getAllStock,
    getCurrentUserPoints, getStock,
} from "../../firebase/firebase";
import {isCurrentUserAdmin, isUserLoggedIn} from "../../firebase/auth";
import {useNavigate} from "react-router-dom";

const Rewards = () => {
    const [points, setPoints] = useState(0);
    const [rewards, setRewards] = useState([]);
    const [isCurrentMachineRaspi, setIsCurrentMachineRaspi] = useState(false);
    const [localCurrentUserAdmin , setlocalCurrentUserAdmin] = useState(false);
    const [canRedeem, setCanRedeem] = useState(false)
    const nav = useNavigate();

    useEffect(() => {
        if (!isUserLoggedIn())
            nav('/login')

        const fetchData = async () => {
            setPoints(await getCurrentUserPoints());
            setRewards(await getAllStock());

            // The machine specifically reports X11 CrOS
            // Rasp* is for Raspberry Pi (Raspbian/Raspberry)
            // arm is for ARM-based machines (armhf, armvl, armv7l, armv8l, etc.)
            setIsCurrentMachineRaspi(
                window.navigator.userAgent.includes("X11; CrOS")
                || window.navigator.userAgent.includes("Rasp")
                || window.navigator.userAgent.includes("arm"));

            console log("===USER AGENT===")
            console.log(window.navigator.userAgent)
            console.log(window.navigator.userAgent.includes("X11; CrOS")
console.log(window.navigator.userAgent.includes("Rasp"))
console.log(window.navigator.userAgent.includes("arm"))


            setlocalCurrentUserAdmin(await isCurrentUserAdmin());
            setCanRedeem(isCurrentMachineRaspi);

            console.log("Is Current Machine Raspi: " + isCurrentMachineRaspi)
            console.log("Local Current User Admin: " + localCurrentUserAdmin)
            console.log("Can Redeem: " + canRedeem)
        }

        fetchData();
    }, []);

    const handleRedeem = (productName, requiredPoints) => {
      const confirmed = window.confirm(`Are you sure you want to redeem ${productName}?`);
      if (confirmed) {
          console.log(`Attempting to redeem ${productName}...`);
          // Check if we have enough points
          console.log("Points: " + points)
          console.log("Required Points: " + requiredPoints)
          console.log("Points - Required Pts: " + (points - requiredPoints))
          if (points >= requiredPoints) {
              // Check if we have enough stock
              getStock(productName).then((stock) => {
                  if (stock <= stock.dispense) {
                      alert("Stock insufficient! You cannot redeem this product.");
                  } else {
                      setPoints(points - requiredPoints); // Update points after redemption
                      decrementStock(productName);
                      addDeductTransactionToCurrentUser(productName, requiredPoints); // Add transaction to user account
                      alert(`Redeeming ${productName}`);
                  }
              });
          } else {
              alert("Points insufficient! You cannot redeem this product.");
          }
      }
  };

    function returnRewards(redeemable) {
        return (
            <section id="features" ref={(node) => {
                if (node) {
                    node.style.setProperty("padding-left", "0px", "important");
                }}}>
                {rewards.map((reward) => {
                return (
                    <div className="product">
                        <img src={reward.iconUrl} alt=""/>
                        <h3>{reward.name}</h3>
                        <p>You need to accumulate <br/><b>{reward.points} points </b> to
                            get <b>{reward.dispense} {reward.dispense > 1 ? reward.name + 's' : reward.name}</b></p>
                        { redeemable ?
                        <button className={points < reward.points ? "redeem-btn disabled" : "redeem-btn"}
                                onClick={() => handleRedeem(reward.name, reward.points)}
                                disabled={points < reward.points || parseInt(reward.dispense) <= 0}>Redeem
                        </button> : null }
                    </div>
                )
            })}
        </section>)
    }

    return (
        <div className="rewards_body">
            <div className="header_rewards">
                <img src={rvmpic} alt="logo"/>
                <h1>S W I F T S W A P | R E W A R D S <br/>
                    Your Total SwiftSwap Points is: {points} points
                </h1>
            </div>

            { /** Not an admin and not on the machine **/ }
            {!canRedeem ? rewards.length === 0 ? null : <h2 style={{textAlign: "center", paddingTop: "20px"}}>Reward redemption can only be done on the machine.</h2> : null}
            {!canRedeem ? returnRewards(false) : null}

            { /** Admin mode message **/ }
            { /** localCurrentUserAdmin ? <h2 style={{textAlign: "center", paddingTop: "20px"}}>You are in admin mode, redeem page is enabled.</h2> : null **/ }

            { /** Admin or on the machine **/ }
            {canRedeem ? rewards.length === 0 ? <h2 style={{textAlign: "center", paddingTop: "20px"}}>Loading rewards, please wait...</h2> : null : null}
            {canRedeem ? returnRewards(true) : null}
        </div>
    )
};
export default Rewards;
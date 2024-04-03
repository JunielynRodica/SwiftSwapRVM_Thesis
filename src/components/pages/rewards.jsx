import React, {useEffect, useState} from "react";
import "../../style/rewards.css";
import bondpaper from '../../assets/bpaper.png';
import ballpen from '../../assets/bpen.png';
import correctiontape from '../../assets/ctape.png';
import eraser from '../../assets/eraser.png';
import highlighter from '../../assets/hlighter.png';
import notebook from '../../assets/ntbook.png';
import paperclip from '../../assets/pclip.png';
import pencil from '../../assets/pencil.png';
import stickynote from '../../assets/snote.png';
import rvmpic from '../../assets/rvmpic.png';
import {
    addDeductTransactionToCurrentUser,
    getCurrentUserPoints,
} from "../../firebase/firebase";
import {isUserLoggedIn} from "../../firebase/auth";
import {useNavigate} from "react-router-dom";
import {useOfflineStore} from "../../store/useOfflineStore";

const Rewards = () => {
    const [points, setPoints] = useState(0);
    const nav = useNavigate();
    const { offlineIsLoggedIn, offlineEmail, offlineDisplayName } = useOfflineStore();

    useEffect(() => {
        if (!isUserLoggedIn())
            if (!offlineIsLoggedIn)
                nav('/login')

        const fetchData = async () => {
            setPoints(await getCurrentUserPoints());
        }

        fetchData();
    }, []);

    const handleRedeem = (productName, requiredPoints) => {
      const confirmed = window.confirm(`Are you sure you want to redeem ${productName}?`);
      if (confirmed) {
          console.log(`Attempting to redeem ${productName}...`);
          if (points >= requiredPoints) {
              setPoints(points - requiredPoints); // Update points after redemption
              addDeductTransactionToCurrentUser(productName, requiredPoints); // Add transaction to user account
              alert(`Redeeming ${productName}`);
          } else {
              alert("Points insufficient! You cannot redeem this product.");
          }
      }
  };
  
  
    return (
      <div className="rewards_body">
      <div className="header_rewards">
        <img src={rvmpic} alt="logo" />
        <h1>S W I F T S W A P | R E W A R D S <br />
        Your Total SwiftSwap Points is: {points} points 
        </h1>
      </div>
    
        
  
  <section id="features">
          <div className="product">
          <img src={bondpaper} alt=""/>
            <h3>Bond Paper</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 1 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('bondpaper', 1)} disabled={points < 1}
  >Redeem </button>
            </div>
  
             <div className="product">
          <img src={ballpen} alt=""/>
            <h3>Ballpen</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 5 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('ballpen', 5)} disabled={points < 5}
  >Redeem </button>
          </div>
  
             <div className="product">
          <img src={correctiontape} alt=""/>
            <h3>Correction Tape</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 5 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('correctiontape', 5)} disabled={points < 5}
  >Redeem </button>
          </div>

          <div className="product">
          <img src={eraser} alt=""/>
            <h3>Eraser</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 5 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('eraser', 5)} disabled={points < 5}
  >Redeem </button>
          </div>
  
          <div className="product">
          <img src={highlighter} alt=""/>
            <h3>Highlighter</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 5 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('highlighter', 5)} disabled={points < 5}
  >Redeem </button>
          </div>
  
          <div className="product">
          <img src={notebook} alt=""/>
            <h3>Notebook</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 5 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('notebook', 5)} disabled={points < 5}
  >Redeem </button>
          </div>
  
          <div className="product">
          <img src={paperclip} alt=""/>
            <h3>Paper Clip</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 5 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('paperclip', 5)} disabled={points < 5}
  >Redeem </button>
          </div>
  
          <div className="product">
          <img src={pencil} alt=""/>
            <h3>Pencil</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 5 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('pencil', 5)} disabled={points < 5}
  >Redeem </button>
          </div>
  
          <div className="product">
          <img src={stickynote} alt=""/>
            <h3>Sticky Note</h3>
            <p>You need to accumulate 5 points to get three pencils</p>
            <button className={points < 5 ? "redeem-btn disabled" : "redeem-btn"} onClick={() => handleRedeem('stickynote', 5)} disabled={points < 5}
  >Redeem </button>
          </div>
        </section>
      </div>
    );
  };

export default Rewards;
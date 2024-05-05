import React, {useEffect, useState} from "react";
import QRCode from "react-qr-code";
import '../../style/dashboard.css';
import input1 from '../../assets/clearS.png';
import input2 from '../../assets/clearM.png';
import input3 from '../../assets/clearL.png';
import input4 from '../../assets/colored.png';
import input5 from '../../assets/aluminumC.png';
import input6 from '../../assets/paper.png';

import step1 from '../../assets/step1.png';
import step2 from '../../assets/step2.png';
import step3 from '../../assets/step3.png';
import step4 from '../../assets/step4.png';
import step5 from '../../assets/step5.png';
import step6 from '../../assets/step6.png';
import rvmpic from '../../assets/rvmpic.png';
import { useQRStore } from "../../store/useQRCreds";
import { getCurrentUserPoints } from "../../firebase/firebase";
import Login from "../auth/login";
import {getQRCodeData, isUserLoggedIn} from "../../firebase/auth";
import {getUserStoreDisplayName, getUserStoreEmail} from "../../contexts/userStore";

const Dashboard = () => {
  const [points, setPoints] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");

  const { QRCreds, saveQRCreds } = useQRStore();

  useEffect(() => {
    const fetchData = async () => {
      setPoints(await getCurrentUserPoints());
      setDisplayName(getUserStoreDisplayName());
      setDisplayEmail(getUserStoreEmail());

      if (QRCreds == null) {
        saveQRCreds(getQRCodeData());
      }
    }

    fetchData();
    console.log("QR DATA: " + QRCreds);
  }, []);

    if (!isUserLoggedIn()) {
        return <Login/>
    }

  return (
    <div className="container_dashboard">
      <div className="header_dashboard">
        <img src={rvmpic} alt='logo'></img>
        <h1>S W I F T S W A P</h1>
      </div>
      <div className='user'>
        <div>Hello {displayName ? displayName : displayEmail}, it's nice to see you again!</div>
        <div>SwiftSwap Points: {points}</div>
        {/* <p className='user-welcome'>WELCOME BACK: USER 384782972</p>
            <p className='user-point'>SwiftSwap Points: 50</p> */}
      </div>
      <br></br>

      <p className="qr-intro">Use this QR Code to Log in on the SwiftSwap Machine. This QR Code's validity is limited to a two-day period.</p>
      <br></br>
      <div style={{height: "auto", margin: "0 auto", maxWidth: 300, width: "100%" }}>
          {
            QRCreds != null ? <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={QRCreds || ''}
              viewBox={`0 0 256 256`}
            /> : <p className="sentence1">Failed to generate QR, please re-login.</p>
          }
        </div>
        <br></br>

        <section className="points">
          <h1 className="equivalents">LET US MAKE EVERY INPUT COUNT!</h1>
          <p className="sentence2">We're excited for you to experience our project! Here are the equivalent points per item!</p>
        </section>
        <div className="input-points">
        <img src={input1} alt="step1"></img>
          <img src={input2} alt="step2"></img>
          <img src={input3} alt="step3"></img>
          <img src={input4} alt="step4"></img>
          <img src={input5} alt="step5"></img>
          <img src={input6} alt="step6"></img>
        </div>

        <section className="intro">
          <h1 className="welcome">HI, WHAT ARE YOU RECYCLING TODAY?</h1>
          <p className="sentence1">We're excited for you to experience our project! Simply follow the instructions below and start swapping now!</p>
        </section>

        <div className="how-to">
          <img src={step1} alt="step1"></img>
          <img src={step2} alt="step2"></img>
          <img src={step3} alt="step3"></img>
          <img src={step4} alt="step4"></img>
          <img src={step5} alt="step5"></img>
          <img src={step6} alt="step6"></img>
        </div>
    </div>
  );
};
export default Dashboard;
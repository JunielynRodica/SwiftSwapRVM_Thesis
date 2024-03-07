import React from "react";
import '../../style/dashboard.css';
import step1 from '../../assets/step1.png';
import step2 from '../../assets/step2.png';
import step3 from '../../assets/step3.png';
import step4 from '../../assets/step4.png';
import step5 from '../../assets/step5.png';
import step6 from '../../assets/step6.png';
import rvmpic from '../../assets/rvmpic.png';
import { useAuth } from '../../contexts/authContext';

const Dashboard = () => {

  const { currentUser } = useAuth()

  return (
    <div className="container_dashboard">
      <header class="header_dashboard">
        <img src={rvmpic} alt='logo'></img>
        <h1>S W I F T S W A P</h1>
      </header>
      <body>
        <div className='user'>
          <div>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, it's nice to see you again!</div>
          {/* <p className='user-welcome'>WELCOME BACK: USER 384782972</p>
            <p className='user-point'>SwiftSwap Points: 50</p> */}
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
      </body>
    </div>
  );
};
export default Dashboard;
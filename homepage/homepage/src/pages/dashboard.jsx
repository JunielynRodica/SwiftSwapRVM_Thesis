import React from "react";
import '../style/dashboard.css';

const Dashboard = () => {
    return(
    <div className="container_dashboard">
      <header class="header">
            <img src="http://tinyurl.com/58djnbxb" alt='logo'></img>
            <h1>S W I F T S W A P</h1>
      </header>
      <body>
        <div className='user'>
            <p className='user-welcome'>WELCOME BACK: USER 384782972</p>
            <p className='user-point'>SwiftSwap Points: 50</p>
        </div>
        <section className="intro">
            <h1 className="welcome">HI! WHAT ARE YOU RECYCLING TODAY?</h1> 
            <p className="sentence1">We're excited for you to experience our project! Simply follow the instructions below and start swapping now!</p>
        </section>
      <div className="how-to">
            <img src="http://tinyurl.com/45j8hy3v" alt="step1"></img>
            <img src="http://tinyurl.com/8nv67752" alt="step2"></img>
            <img src="http://tinyurl.com/45uxwcn6" alt="step3"></img>
            <img src="http://tinyurl.com/mr43kb58" alt="step4"></img>
            <img src="http://tinyurl.com/2p9ud5wt" alt="step5"></img>
      </div>
      </body>
    </div>
    );
};
export default Dashboard;
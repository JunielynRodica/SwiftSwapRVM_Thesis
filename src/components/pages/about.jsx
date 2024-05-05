import React from "react";
import '../../style/about.css';
import rvmpic from '../../assets/rvmpic.png';
import {isUserLoggedIn} from "../../firebase/auth";
import Login from "../auth/login";

const About = () => {

    if (!isUserLoggedIn()) {
        return <Login/>
    }

    return(
        <div className="about-page">
        <div className="aboutswift">
            <img  className="pic1" src={rvmpic} alt="logo_swiftswap"></img>
        </div>
        <body className="about-body">
            <section className="swiftparagraph">
                <h1 className="aboutswiftswap">About SwiftSwap</h1>
                <div className="section-divider"></div> 
                <br></br>
                <p>SwiftSwap is an AI-driven reverse vending machine, strategically designed to encourage sustainable
                    recycling practices and incentivize environmentally responsible actions. Through this innovative
                    technology, PET bottles, cans, and papers can be exchanged for points redeemable for essential school supplies.
                    This advanced method not only promotes environmental sustainability but facilitates educational support effectively.
                </p>
            </section>
            <br></br>
            <section className="swiftmission">
                <h1 className="aboutmission">SwiftSwap's Mission</h1>
                <br></br>
                <p>
                    To encourage individuals to take an active role in protecting the environment while simultaneously addressing 
                    educational needs.
                </p>
            </section>
            <br></br>
            <section className="swiftvision">
                <h1 className="aboutvision">SwiftSwap's Vision</h1>
                <br></br>
                <p>
                    To establish the university as a leader in sustainability initiatives by offering convenient and effective 
                    recycling solutions that inspire positive environmental action among students, faculty and staff of Rizal
                    Technological University.
                </p>
            </section>
            <br></br>
            <section className="cornerstone-concepts">
                <h1>SwiftSwap's Cornerstone Concepts</h1>
                <br></br>
                <ul>
                    <li className="one">Sustainable Solutions</li>
                    <p> SwiftSwap transforms waste into school supplies, promoting environmental stewardship and resource conservation.</p>
                    <br></br>
                    <li className="two">Wired Innovation</li>
                    <p>Leveraging cutting-edge technology, SwiftSwap embodies innovative design to efficiently recycle waste materials into educational resources.</p>
                    <br></br>
                    <li className="three">Academic Empowerment</li>
                    <p>By providing school supplies generated from recycled waste, SwiftSwap empowers students with the tools they need to excel academically.</p>
                    <br></br>
                    <li className="four">Participatory Collaboration</li>
                    <p>Engaging students, faculty, and the community in the recycling process, SwiftSwap fosters collaborative efforts toward sustainability and educational enrichment.</p>
                </ul>
            </section>
        </body>
        </div>
    );
};

export default About;
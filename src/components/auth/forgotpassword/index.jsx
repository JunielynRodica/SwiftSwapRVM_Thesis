import React, { useEffect, useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import rvmpic from '../../../assets/rvmpic.png';
import emailIcon from '../../../assets/Email.png';
import '../../../style/forgotpw.css'

import { useAuth } from '../../../contexts/authContext';

const ForgotPassword = () => {
    const { userLoggedIn } = useAuth();

    return (
        <main>
            {userLoggedIn && <Navigate to={'/dashboard'} replace={true} />}
            <div className='forgotContainer'>
                <div className='forgotHeader'>
                    <img src={rvmpic} className='forgotLogo'></img>
                    <h1 className='forgotTitle'>S w i f t S w a p</h1>
                    <h2>Please provide your email address. We'll send you a link to your email to reset your password in just a few moments.</h2>
                    <br></br>
                    <div className='forgetInput'>
                    <img src={emailIcon}></img>
                    <input className='forgetEmail' type='email' required placeholder='Enter Email here.' ></input>
                    <input className='forgotButton' type='submit' value='Reset Password'></input>
                    <p>Go back to <Link to="/login">Log in</Link></p>
                    </div>
                </div>
            </div>

            {/* //for next page// 
            <div className='resetContainer'>
            <h2>Reset your Password</h2>
                <div className="resetInput">
                    <img src={passwordIcon}></img>
                    <input className="resetNew" type='password' required placeholder='Enter New Password'></input>
                    <p className="resetText">Password must be atleast 6 characters.</p>
                    <img src={confirmIcon}></img>
                    <input className="confirmNew" type='password' required placeholder='Confirm New Passowrd'></input>
                    <input classname='resetButton' type='submit' value='Reset Password'></input>
                </div>
            </div> */}
            
        </main>
    );
};

export default ForgotPassword;

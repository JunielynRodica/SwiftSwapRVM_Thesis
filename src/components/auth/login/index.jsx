import React, { useEffect, useState } from 'react';

import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithCustomToken } from '../../../firebase/auth';
import CryptoJS from 'crypto-js';

import { useAuth } from '../../../contexts/authContext';
import qr_icon from '../../../assets/qrlogin.png';
import email_icon from '../../../assets/Email.png';
import password_icon from '../../../assets/Password.png';
import qrscan from '../../../assets/qrscan.png';
import '../../../style/login.css';

import { useQRStore } from '../../../store/useQRCreds';

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isScanning, setScanning] = useState(false);

    const [queryParameters] = useSearchParams()
    const { saveQRCreds } = useQRStore();

    const checkParams = async (qrCreds) => {
        if (qrCreds) {
            if (!isSigningIn) {
                setIsSigningIn(true);

                const sanitizedEncrypted = qrCreds.replace(/\s/g, '+');
                const decrypted = CryptoJS.AES.decrypt(sanitizedEncrypted, process.env.REACT_APP_cryptokey).toString(CryptoJS.enc.Utf8);

                const { email, password } = JSON.parse(decrypted);

                await doSignInWithEmailAndPassword(email, password).then((res) => {
                    console.log('qr_encrypted save: ', res.qr_encrypted)
                    saveQRCreds(res.qr_encrypted);
                });

                // await doSignInWithCustomToken(token).then((res) => {
                //     console.log('res token: ', res.access_token)
                //     saveQRCreds(res.access_token);
                // });
            }
        }
    };

    useEffect(() => {
        const qr_param = queryParameters.get('qrCreds') || null;
        if (qr_param) {
            checkParams(qr_param);
            //console.log('token param: ', qr_param)
        }
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password).then((res) => {
                console.log('qr_encrypted: ', res.qr_encrypted)
                saveQRCreds(res.qr_encrypted);
            });
        }
    };

    const startScanning = () => {
        setScanning(true);
        const queryParameters = new URLSearchParams(window.location.search);
        queryParameters.set('scan', true);

        const newUrl = `${window.location.pathname}?${queryParameters.toString()}`;
        window.history.pushState({}, '', newUrl);
    }

    const stopScanning = () => {
        setScanning(false);

        const newUrl = `${window.location.pathname}`;
        window.history.pushState({}, '', newUrl);
    }

    return (
        <div>
            {userLoggedIn && <Navigate to={'/dashboard'} replace={true} />}

            <main className="login">
                <div className="container_login">
                    <div className="left-content">
                        {
                            isScanning ?
                                <div className="scanner">
                                    <p className="scanning_text"> </p>
                                    <img src={qrscan} alt="qrscanner" className="qrscanner" />
                                    <button className="cancel_button" onClick={() => stopScanning()} >Cancel</button>
                                </div>
                                :
                                <button onClick={() => startScanning()} className="qr_button">
                                    <img src={qr_icon} alt="qr" className="login-image" />
                                </button>
                        }

                        {/* <hr className="separator" /> */}

                    </div>
                    <div className="right-content">
                        <h3 className="header_login">Welcome Back</h3>
                        <form onSubmit={onSubmit}>
                            <div className="inputs">
                                <div className="input">
                                    <img src={email_icon} alt="" />
                                    <input type="email" placeholder="Email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="input">
                                    <img src={password_icon} alt="" />
                                    <input type="password" placeholder="Password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>
                            {errorMessage && <span className="forgot-password">{errorMessage}</span>}
                            <div className="submit-container">
                                <button type="submit" className="submit" disabled={isSigningIn}>
                                    {isSigningIn ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>
                        </form>
                        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;

import React, { useEffect, useState } from 'react';

import { Navigate, Link, useSearchParams } from 'react-router-dom';
import {
    doSignInWithEmailAndPassword,
    doSignInWithCustomToken,
    doOfflineSignInWithQrCode,
} from '../../../firebase/auth';
import CryptoJS from 'crypto-js';

import { useAuth } from '../../../contexts/authContext';
import qr_icon from '../../../assets/qrlogin.png';
import email_icon from '../../../assets/Email.png';
import password_icon from '../../../assets/Password.png';
import qrscan from '../../../assets/qrscan.png';
import '../../../style/login.css';

import { useQRStore } from '../../../store/useQRCreds';
import QrReader from 'react-qr-scanner'
import {getUserStoreSignedIn, setUserStoreSignedIn} from "../../../contexts/userStore";

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

                await doSignInWithEmailAndPassword(email, password).then(async (res) => {
                    await saveQRCreds(res.qr_encrypted);
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
        }
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password).then(async (res) => {
                if (res)
                    saveQRCreds(res.qr_encrypted);
                else {
                    alert('Invalid username or password!');
                    setIsSigningIn(false);
                }
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

    const handleError = (e) => {
        window.alert('Error scanning QR code, check console for errors');
        console.error(e);
    }

    const handleScan = async (data) => {
        if (isSigningIn) return;
        if (data == null) return;

        setIsSigningIn(true);

        if (!navigator.onLine) {
           console.log("Doing offline sign in with QR")
           await doOfflineSignInWithQrCode(data.text).then((res) => {
                if (res) {
                    saveQRCreds(res.qr_encrypted);
                }
                else {
                    alert('Login Failed. Please try another QR Code.');
                    setIsSigningIn(false);
                    window.location.reload();
                }
            });
        } else {
            await doSignInWithCustomToken(data.text).then((res) => {
                if (res)
                    saveQRCreds(res.qr_encrypted);
                else {
                    alert('QR Code has expired. Please login again.');
                    setIsSigningIn(false);
                    window.location.reload();
                }
            });
        }
    }

    return (
        <div>
            {(getUserStoreSignedIn()) && <Navigate to={'/dashboard'} replace={true} />}

            <main className="login">
                <div className="container_login">
                    <div className="left-content">
                        {
                            isScanning ?
                                <div className="scanner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', }}>
                                    <p className="scanning_text"> </p>
                                    <QrReader
                                        delay={100}
                                        onError={handleError}
                                        onScan={handleScan}
                                        style={{ width: '100%', maxWidth: '500px' }}
                                    />
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
                        <div style={{ display: navigator.onLine ? 'block' : 'none' }}>
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
                                {/* {errorMessage && <span className="forgot-password">{errorMessage}</span>} */}
                                <div className="submit-container">
                                    <button type="submit" className="submit" disabled={isSigningIn}>
                                        {isSigningIn ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </div>
                            </form>
                            <p><Link to="/forgotpassword">Forgot Password</Link></p>
                            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                        </div>
                        <div style={{ display: !navigator.onLine ? 'block' : 'none' }}>
                            <p>Currently offline. Please scan QR code to login.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;

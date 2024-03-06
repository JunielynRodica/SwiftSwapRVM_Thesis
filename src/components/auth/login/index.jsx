import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import qr_icon from '../../../assets/qrlogin.png'; 
import email_icon from '../../../assets/Email.png'; 
import password_icon from '../../../assets/Password.png'; 
import '../../../style/login.css';

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password);
        }
    };

    return (
        <div>
            {userLoggedIn && <Navigate to={'/dashboard'} replace={true} />}

<main className="login">
    <div className="container_login">
        <div className="left-content">
            <img src={qr_icon} alt="Login Image" className="login-image" />
            <hr className="separator" />
        </div>
        <div className="right-content">
            <h3 className="header_login">Welcome Back</h3>
            <form onSubmit={onSubmit}>
                <div className="inputs">
                    <div className="input">
                    <img src={email_icon} alt=""/>
                        <input type="email" placeholder="Institutional Email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input">
                    <img src={password_icon} alt=""/>
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

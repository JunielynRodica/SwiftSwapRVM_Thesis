import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import rvmpic1 from '../../../assets/rvmpic1.png'; 
import email_icon from '../../../assets/Email.png'; 
import password_icon from '../../../assets/Password.png';  
import student_icon from '../../../assets/Person.png';  
import cpass_icon from '../../../assets/confirmpass.png';  
import '../../../style/register.css';

const Register = () => {
    const { userLoggedIn } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [studentNumber, setStudentNumber] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            await doCreateUserWithEmailAndPassword(email, password, studentNumber)
        }
    }
    return (
        // <div>
          
            <section className="register">
                {userLoggedIn && <Navigate to={'/dashboard'} replace={true} />}
                <div className='outer-wrapper'>
                    <div className="inner-wrapper">
                            <div className="register_left">
                                <img src={rvmpic1} alt="reg" className="reg_icon" />
                                <hr className="reg-separator"/>
                            </div>
                            <div className="right-content">
                                <h3 className="header_register">Create a New Account</h3>
                                <form onSubmit={onSubmit}>
                                    <div className="reg_inputs">
                                        <div className="reg_input">
                                        <img src={email_icon} alt=""/>
                                            <input type="email" placeholder="Institutional Email" autoComplete="email"  required value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="reg_input">
                                        <img src={student_icon} alt=""/>
                                            <input type="text" autoComplete='off' placeholder="Student / Employee Number" required value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
                                        </div>
                                        <div className="reg_input">
                                        <img src={password_icon} alt=""/>
                                            <input type="password" autoComplete="new-password" placeholder="Password" disabled={isRegistering} required value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <div className="reg_input">
                                        <img src={cpass_icon} alt=""/>
                                            <input type="password" autoComplete="off" placeholder="Confirm Password" disabled={isRegistering} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    {errorMessage && <span className="forgot-password">{errorMessage}</span>}
                                    <div className="submit-container">
                                        <button type="submit" className="submit" disabled={isRegistering}>
                                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                                        </button>
                                    </div>
                                </form>
                                <p>Already have an account? <Link to="/login">Sign in</Link></p>
                        
                            </div>
                    </div>
                </div>
            </section>
        // </div>
    );
};

export default Register;
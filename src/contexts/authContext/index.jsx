import React, { useContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Sidebar from "../../components/sidebar";
import Rewards from "../../components/pages/rewards";
import About from "../../components/pages/about";
import Dashboard from "../../components/pages/dashboard";
import TransactionHistory from "../../components/pages/TransactionHistory";
import {getUserStoreSignedIn, setUserStoreSignedIn} from "../userStore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, [getUserStoreSignedIn()]);

  async function initializeUser(user) {
    if (user) {

      setCurrentUser({ ...user });

      // check if provider is email and password login
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);
    } else {
      setCurrentUser(null);
    }
  }

  const value = {
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {(getUserStoreSignedIn()) ? (
        <Sidebar>
          {children}
        </Sidebar>
      ) : children
      }
    </AuthContext.Provider>
  );
}

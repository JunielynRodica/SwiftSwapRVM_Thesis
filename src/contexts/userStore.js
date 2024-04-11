import { create } from 'zustand';
import {getUserDataFromFirestore} from "../firebase/firebase";

let userUid = "";
let userEmail = "";
let userDisplayName = "";
let isLoggedIn = false;

export function getUserStoreSignedIn() {
    return isLoggedIn;
}

export function setUserStoreSignedIn(value) {
    isLoggedIn = value;
}

export function getUserStoreUid() {
    if (userUid === "" && isLoggedIn) {
        // Something has gone wrong, reload the page
        userStoreLogout();
        window.location.reload();
        return "";
    }
    return userUid;
}

export function getUserStoreEmail() {
    return userEmail;
}

export function getUserStoreDisplayName() {
    return userDisplayName;
}

export function userStoreLogin(uid, email, displayName) {
    userUid = uid;
    userEmail = email;
    userDisplayName = displayName;
    isLoggedIn = true;
}

export function userStoreLogout() {
    userUid = "";
    userEmail = "";
    userDisplayName = "";
    isLoggedIn = false;
}
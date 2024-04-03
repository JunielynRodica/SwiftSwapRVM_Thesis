import {getUserDataFromFirestore} from "../firebase/firebase";

let offlineUserUid = "";
let isOffline = false;
let offlineEmail = "";
let offlineDisplayName = "";


export function loginOfflineUser(uid) {
    offlineUserUid = uid;
    isOffline = true;

    // Get the user's email and display name
    getUserDataFromFirestore(uid).then((data) => {
        offlineEmail = data.email;
        offlineDisplayName = data.display_name;
    });
}

export function logoutOfflineUser() {
    offlineUserUid = "";
    isOffline = false;
}

export function isUserOffline() {
    return isOffline;
}

export function getOfflineUserUid() {
    return offlineUserUid;
}

export function getOfflineUserEmail() {
    return offlineEmail;
}

export function getOfflineUserDisplayName() {
    return offlineDisplayName;
}
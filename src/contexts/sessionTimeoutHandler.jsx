import { doSignOut } from "../firebase/auth";

let sessionTimeout = {};

export function startSessionTimeout(time) {
    sessionTimeout = setTimeout(() => {
        // Display session timeout message
        alert("Your session has timed out. You will be logged out.");

        // Sign out the user
        doSignOut().then(() => {
            stopSessionTimeout();
            window.location.reload();
        });
    }, time);
}

export function stopSessionTimeout() {
    clearTimeout(sessionTimeout);
}

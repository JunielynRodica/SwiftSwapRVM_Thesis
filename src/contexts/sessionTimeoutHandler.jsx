import { doSignOut } from "../firebase/auth";

let sessionTimeout = {};

export function startSessionTimeout(time) {
    sessionTimeout = setTimeout(() => {
        alert("Your session has timed out. You will be logged out.");

        doSignOut()
        stopSessionTimeout();
        window.location.reload();
    }, time);
}

export function stopSessionTimeout() {
    clearTimeout(sessionTimeout);
}

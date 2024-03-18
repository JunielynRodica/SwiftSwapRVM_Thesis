import {doSignOut} from "../firebase/auth";

let sessionTimeout = {}

export function startSessionTimeout(time) {
    sessionTimeout = setTimeout(() => {
        doSignOut().then(() => {
            stopSessionTimeout();
            window.location.reload();
        });
    }, time);
}

export function stopSessionTimeout() {
    clearTimeout(sessionTimeout);
}
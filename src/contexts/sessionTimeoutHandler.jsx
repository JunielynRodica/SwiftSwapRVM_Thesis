import {doSignOut} from "../firebase/auth";

let sessionInterval = {}

export function startSessionTimeout(time) {
    sessionInterval = setInterval(() => {
        doSignOut().then(() => {
            stopSessionTimeout();
            window.location.reload();
        });
    }, time);
}

export function stopSessionTimeout() {
    clearInterval(sessionInterval);
}
import { create } from 'zustand';
import { getAuth } from "firebase/auth";

export const useQRStore = create((set) => ({
    QRCreds: null,
    //you just need to call "saveQRCreds" to set the value of the state
    saveQRCreds: (creds) => {
        set({ QRCreds: creds })
    }
}));
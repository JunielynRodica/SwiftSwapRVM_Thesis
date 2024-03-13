import { create } from 'zustand';
import { getAuth } from "firebase/auth";

export const useQRStore = create((set, get) => ({
    QRCreds: null,
    //you just need to call "saveQRCreds" to set the value of the state
    saveQRCreds: (creds) => {
        set({ QRCreds: creds })
    },
    //you just need to call "QRCreds" to get the value of the state
    //you dont need this to get the value
    getQrCreds: () => {
        return get().QRCreds;
    }
}));
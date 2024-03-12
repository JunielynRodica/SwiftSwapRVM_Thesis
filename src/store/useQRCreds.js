import { create } from 'zustand';
import { getAuth } from "firebase/auth";

export const useQRStore = create((set, get) => ({
    QRCreds: null,
    saveQRCreds: (creds) => {
        set({ QRCreds: creds })
    },
    getQrCreds: () => {
        return get().QRCreds;
    }
}));
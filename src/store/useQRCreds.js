import { create } from 'zustand';

export const useQRStore = create((set) => ({
    QRCreds: null,
    saveQRCreds: async (creds) => {
        try {
            set({ QRCreds: creds });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
}));
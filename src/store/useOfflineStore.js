import { create } from 'zustand';
import {getUserDataFromFirestore} from "../firebase/firebase";

export const useOfflineStore = create((set) => ({
    offlineUserUid: "",
    offlineIsLoggedIn: false,
    offlineEmail: "",
    offlineDisplayName: "",

    loginOfflineUser: (uid) => {
        set({ offlineIsLoggedIn: true, offlineUserUid: uid });

        // Get the user's email and display name
        getUserDataFromFirestore(uid).then((data) => {
            set({ offlineEmail: data.email, offlineDisplayName: data.display_name });
        });
    },

    logoutOfflineUser: () => {
        set({ offlineUserUid: "", offlineIsLoggedIn: false, offlineEmail: "", offlineDisplayName: "" });
    }
}));
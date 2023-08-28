// store.ts o store/index.ts
import { defineStore } from 'pinia'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} from 'firebase/auth'
import { auth } from '../firebaseConfig';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        loggedIn: false,
        data: null
    }),
    getters: {
        user() {
            return this.data;
        }
    },
    actions: {
        async register({ email, password, name }) {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            if (response) {
                this.data = response.user;
                await (response.user as any).updateProfile({ displayName: name });
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("password", password);
            } else {
                throw new Error('Unable to register user');
            }
        },
        async logIn({ email, password }) {
            const response = await signInWithEmailAndPassword(auth, email, password);
            if (response) {
                this.data = response.user;
                this.loggedIn = true;
                return true;
            } else {
                this.loggedIn = false;
                throw new Error('login failed');
                return true;
            }
        },
        async logOut() {
            await signOut(auth);
            this.data = null;
        },
        fetchUser(user) {
            this.loggedIn = user !== null;
            if (user) {
                this.data = {
                    displayName: user.displayName,
                    email: user.email
                };
                sessionStorage.setItem("user", user);
            } else {
                this.data = null;
            }
        }
    }
});

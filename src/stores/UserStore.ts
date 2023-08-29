// store.ts o store/index.ts
import { defineStore } from 'pinia'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut, updateProfile} from 'firebase/auth'
import { auth, googleProvider } from '../firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup  } from 'firebase/auth'
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';


export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        loggedIn: false,
        data: null,
        complementedData : null
    }),
    getters: {
        user() {
            return this.data;
        }
    },
    actions: {
        async register({ email, password, name, description, code, displayName, photoURL }) {
            console.log("Inicio de la función register");
            try {
                const response = await createUserWithEmailAndPassword(auth, email, password);
                console.log("Usuario creado con Firebase Auth:", response);

                this.data = response.user;
                try {
                    await updateProfile({ displayName: displayName, photoURL: photoURL });
                    console.log("Perfil actualizado");
                } catch (error) {
                    console.error("Error al actualizar el perfil:", error);
                }
                console.log("Usuario autenticado:", auth.currentUser);

                console.log(displayName)
                const userDocRef = doc(db, 'users', response.user.uid);
                const r = await setDoc(userDocRef, {
                    description: description,
                    displayName: displayName,
                    code: code,
                    photoURL: photoURL
                });
                console.log("Datos guardados en Firestore:", r);
                this.data = response.user;
                this.loggedIn = true;
                await this.fetchComplementedData(response.user.uid);
            } catch (error) {
                console.error("Error en la función register:", error);
            }
        },
        async logIn({ email, password }) {
            const response = await signInWithEmailAndPassword(auth, email, password);
            if (response) {
                this.data = response.user;
                this.loggedIn = true;
                await this.fetchComplementedData(response.user.uid);
                return true;
            } else {
                this.loggedIn = false;
                throw new Error('login failed');
                return true;
            }
        },
        async signInWithGoogle() {
            try {
                const response = await signInWithPopup(auth, googleProvider);
                if (response) {
                    this.data = response.user;
                    this.loggedIn = true;
                    await this.fetchComplementedData(response.user.uid);
                } else {
                    throw new Error('Google sign-in failed');
                }
            } catch (error) {
                console.error("Error signing in with Google: ", error);
                throw error;
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
        },
        async fetchComplementedData(uid: any) {
            try {
                const userDocRef = doc(db, 'users', uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    this.data.complementedData = docSnap.data();
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching complemented data:", error);
            }
        }

    }
});

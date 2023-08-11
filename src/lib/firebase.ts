// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiJbkCw-SQaMOUYcBgxgbtC79WRqPkelc",
  authDomain: "linksite-972ae.firebaseapp.com",
  projectId: "linksite-972ae",
  storageBucket: "linksite-972ae.appspot.com",
  messagingSenderId: "983084691161",
  appId: "1:983084691161:web:ffa5c809ae0eef499b18c8",
  measurementId: "G-R0D4GRRF8R",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage();

const userStore = () => {
  let unsubribe = () => {}
  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }
  const {subscribe } = writable(auth?.currentUser ?? null, (set) => {
    onAuthStateChanged(auth, (user) => {
      set(user)
    })
    return () => unsubribe()
  })
  return {
    subscribe
  }
}

export const user = userStore()

export const docStore = <T>(path: string) =>{
  let unsubscribe: () => void
  const docRef = doc(db, path)
  const {subscribe} = writable<T | null>(null, (set) => {
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null)
    })
  })
  return {
    subscribe,
    ref: docRef,
    id: docRef.id 
  }
}

interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: any[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
  if ($user) {
    return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
  } else {
    set(null); 
  }
});  




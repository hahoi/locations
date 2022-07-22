import { defineStore } from 'pinia';
import { uid, date, Notify, extend } from 'quasar'
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';


export const authStore = defineStore('locationStore', {
  state: () => ({
    uid: "",
    user: {},
  }),

  getters: {}, //endgetters

  actions: {

    set_uid (val) {
      this.uid = val
    },


  }//end actions




})

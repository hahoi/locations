import { defineStore } from 'pinia';
import { getFirebaseConfig } from '../utils/firebase-config.js';
import { initializeApp } from 'firebase/app';

import { uid, date, Notify, extend } from 'quasar'
// import { showErrorMessage } from "src/utils/function-show-error-message";

import funMap from "../assets/funMap.js";


import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';

const firebaseApp = initializeApp(getFirebaseConfig());

// 轉換成陣列
const locations = Object.keys(funMap).map((key) => funMap[key]);


export const locationStore = defineStore('locationStore', {
  state: () => ({
    counter: 0,
    funparks: null, //{}
    locations: locations,
    search: "",
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2
    },
    // getFunParks () {
    //   const funparks = Object.keys(store.funparks).map((key) => {
    //     // console.log(key, store.funparks[key]);
    //     let t = store.funparks[key];
    //     return {
    //       address: t.address,
    //       name: t.title,

    //       // 存檔用
    //       // let coords = new firebase.firestore.GeoPoint(lat, lng);
    //       //Firestore.GeoPoint 轉換
    //       lat: t.coords.latitude,
    //       lng: t.coords.longitude,
    //       // naveUrl: t.naveUrl
    //     };
    //   });
    //   // console.log(data.map);
    // },
    locationsFiltered () {
      let locationsSorted = this.locations
      let locationsFiltered = {}

      let searchWord = this.search.trim();
      //過濾條件用空白分割成字串，用正則可一個或多個空白去分割
      let arraySearchWord = searchWord.split(/\s+/);

      if (this.search) {
        Object.keys(locationsSorted).forEach((id) => {
          let task = locationsSorted[id]

          let ok_flag = true; // and 都符合
          //用arr_flag保存每筆資料對每個關鍵字比對結果
          let arr_flag = [];
          let x = arraySearchWord.length; // flag陣列長度=要搜尋關鍵字的個數
          while (x--) {
            arr_flag[x] = false; //先將判斷flag，全部設為 false
          }


          //每一筆資料比對多個關鍵字 and
          arraySearchWord.forEach((keyword, index) => {

            // console.log(keyword)

            //搜尋每個欄位
            Object.keys(task).forEach((key) => {
              //搜尋文字型態個欄位
              if (typeof task[key] === 'string') {
                let item = task[key]
                // console.log(key,task[key])
                let searchLowerCase = keyword.toLowerCase()
                if (item.includes(searchLowerCase)) {
                  // locationsFiltered[id] = task
                  arr_flag[index] = true; //先把符合的記下來
                }
              }
            })
          })

          //判斷每一筆資料是否符合多個關鍵字
          //搜尋多條件，and 計算，其中一個是false就不符合
          arr_flag.forEach(function (a) {
            if (a == false) {
              ok_flag = false; //and
            }
          });

          //全部搜尋關鍵字都符合
          if (ok_flag) {
            locationsFiltered[id] = task
          }


        })
        return locationsFiltered
      }
      return locationsSorted

    },
    locationsFilteredArray () {
      return Object.keys(this.locationsFiltered).map((key) => this.locationsFiltered[key])
    }
  },

  actions: {
    increment () {
      this.counter++
    },
    set_search (val) {
      this.search = val
    },

    //查，全部
    async queryfunparks () {
      this.funparks = {}
      try {
        const q = query(
          collection(getFirestore(), "funParks")
        );
        const qSnap = await getDocs(q);
        qSnap.forEach((doc) => {
          this.funparks[doc.id] = doc.data()
        });
        // console.log(this.funparks)
      } catch (error) {
        console.error("Firestore 錯誤", error);
      }
    },






  }
})

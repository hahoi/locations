import { defineStore } from 'pinia';
import { getFirebaseConfig } from '../utils/firebase-config.js';
import { initializeApp } from 'firebase/app';

import { uid, date, Notify, extend } from 'quasar'
// import { showErrorMessage } from "src/utils/function-show-error-message";



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

import {
  getStorage,
  ref as StorageRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const firebaseApp = initializeApp(getFirebaseConfig());
export const locationStore = defineStore('locationStore', {
  state: () => ({
    counter: 0,
    funparks: null, //{}
    locations: [], //mergeMap, //[]
    search: "",
    currentID: "",
    locationDataReady: false,
    normalRouter: null,
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
                // console.log(key, task[key])
                let searchLowerCase = keyword.toLowerCase()
                if (item.includes(searchLowerCase)) {
                  // locationsFiltered[id] = task
                  arr_flag[index] = true; //先把符合的記下來
                }
              }
              // 針對每個段落搜尋
              if (key === '段落') {
                task[key].forEach(elm => {
                  // console.log(elm)
                  //搜尋elm中每個欄位
                  Object.keys(elm).forEach((key) => {
                    if (typeof elm[key] === 'string') {
                      // 段落中符合的文字，記錄下來
                      // console.log(key, task[key],searchLowerCase)
                      let item = elm[key]
                      let searchLowerCase = keyword.toLowerCase()
                      if (item.includes(searchLowerCase)) {
                        // locationsFiltered[id] = task
                        arr_flag[index] = true; //先把符合的記下來
                      }
                    }

                  })

                }) //end 段落
              } //end if
            }) //end Object.key
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
    set_normalRouter (val) {
      this.normalRouter = val
    },
    increment () {
      this.counter++
    },
    set_search (val) {
      this.search = val
    },
    set_current_Id (val) {
      this.currentId = val
    },
    set_dataReady (val) {
      this.locationDataReady = val
    },
    // 更新公園資料，這個function用不到

    //查，全部
    async queryFunParks () {
      // this.funparks = {} 物件
      this.locations = []
      try {
        const q = query(
          collection(getFirestore(), "FunParks"), orderBy("id", "desc"));
        // collection(getFirestore(), "FunParks"));
        const qSnap = await getDocs(q);
        qSnap.forEach((doc) => {
          // this.funparks[doc.id] = doc.data() //物件
          this.locations.push({ id: doc.id, ...doc.data() }) //陣列
        });
        // console.log(this.locations)
        console.log("dataReady")
        this.locationDataReady = true;
      } catch (error) {
        console.error("Firestore 錯誤", error);
      }
    },
    //刪除資料
    async deleteFuncPark (id) {
      Notify.create({
        type: 'positive',
        message: '資料刪除中...',
        position: "center",
        timeout: 1000,
      })
      try {
        const park = this.locations.find((item) => id == item.id);
        // console.log(park, park.id, id)
        // 將 storage中檔案刪除
        park.段落.forEach(item => {
          if (item.照片) {
            // 段落只有一張照片，不須循環
            // console.log(item.照片.findKey)
            this.storageImgDelete(item.照片.findKey);
          }
        })
        park.廁所.forEach(item => {
          if (item.照片) {
            item.照片.forEach(elm => {
              // console.log(elm.findKey)
              this.storageImgDelete(elm.findKey);
            })
          }
        })
        park.停車場.forEach(item => {
          if (item.照片) {
            item.照片.forEach(elm => {
              // console.log(elm.findKey)
              this.storageImgDelete(elm.findKey);
            })
          }
        })
        park.附近美食.forEach(item => {
          if (item.照片) {
            item.照片.forEach(elm => {
              // console.log(elm.findKey)
              this.storageImgDelete(elm.findKey);
            })
          }
        })
        park.便利商店.forEach(item => {
          if (item.照片) {
            item.照片.forEach(elm => {
              // console.log(elm.findKey)
              this.storageImgDelete(elm.findKey);
            })
          }
        })
        // 刪除資料庫
        await deleteDoc(doc(getFirestore(), "FunParks", id));
        //重新讀取資料庫
        this.queryFunParks()
      } catch (error) {
        console.error("firebase 有錯誤發生", error);
      }

    },
    // 將 storage中檔案刪除
    storageImgDelete (findKey) {
      const storage = getStorage();
      // console.log(findKey);
      const desertRef = StorageRef(storage, findKey);
      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          console.log("檔案刪除成功！");
        })
        .catch((error) => {
          console.log("錯誤發生");
        });
    },

    // 存入資料
    async saveFunpark (payload) {
      // console.log(payload.data)
      Notify.create({
        type: 'positive',
        message: '資料存檔中...',
        position: "center",
        timeout: 1000,
      })
      try {
        const cityRef = doc(getFirestore(), 'FunParks', payload.id);
        await setDoc(cityRef, payload.data)
      } catch (error) {
        console.error("firebase 有錯誤發生", error);
      }
    },


    // 更新資料
    async updateFunpark (payload) {
      // console.log(payload.data)
      Notify.create({
        type: 'positive',
        message: '資料存檔中...',
        timeout: 1000,
      })
      try {
        const cityRef = doc(getFirestore(), 'FunParks', payload.id);
        await updateDoc(cityRef, payload.data)
      } catch (error) {
        console.error("firebase 有錯誤發生", error);
      }
    },

    async uploadPhoto (payload) {
      try {
        // //如果已經有圖檔，因為只要一個，所以要先刪除
        const findKey = "/FunParks/" + payload.id + "/" + payload.files[0].name;
        // console.log(findKey);
        const newImageRef = StorageRef(getStorage(), findKey);
        const fileSnapshot = await uploadBytes(newImageRef, payload.files);
        // 3 - Generate a public URL for the file.
        const publicImageUrl = await getDownloadURL(newImageRef);
        // console.log(publicImageUrl)
        return {
          findKey: findKey,
          url: publicImageUrl
        }
      } catch (error) {
        console.error("firebase 有錯誤發生", error);
      }
    }






  } //end action
})

import { defineStore } from 'pinia';
import { getFirebaseConfig } from '../utils/firebase-config.js';
import { initializeApp } from 'firebase/app';

import { uid, date, Notify, extend } from 'quasar'
// import { showErrorMessage } from "src/utils/function-show-error-message";

import funMap from "../assets/Pingtung.js";


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
  ref as StorageRef, uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";



import proj4 from "proj4";
import Tainan from "../assets/Tainan";
import Taipei from "../assets/Taipei";
import Pingtung from "../assets/Pingtung";


//defs
proj4.defs([
  [
    "EPSG:4326",
    "+title=WGS84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
  ],
  [
    "EPSG:3826",
    "+title=TWD97 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
  ],
  [
    "EPSG:3828",
    "+title=TWD67 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +towgs84=-752,-358,-179,-0.0000011698,0.0000018398,0.0000009822,0.00002329 +units=m +no_defs",
  ],
]);

//EPSG
let EPSG3826 = new proj4.Proj("EPSG:3826"); //TWD97 TM2(121分帶)
let EPSG3828 = new proj4.Proj("EPSG:3828"); //TWD67 TM2(121分帶)
let EPSG4326 = new proj4.Proj("EPSG:4326"); //WGS84


const TainanMap = Tainan.map((item) => {
  let x = Number(item.X坐標);
  let y = Number(item.Y坐標);
  let latlng = proj4(EPSG3826, EPSG4326, [x, y]);
  const data = {
    設施: "",
    簡介: "",
    介紹: "",
    navi: "",
    便利商店: [],
    段落: [],
    停車場: [],
    廁所: [],
    附近美食: [],
  };
  (data.lat = latlng[1]), (data.lng = latlng[0]);

  for (let key in item) {
    if (key === "Seq") {
      // data.Seq = item.Seq;
    } else if (key === "編號") {
      // data.編號 = item.編號;
    } else if (key === "縣市") {
      data.縣市 = "台南市";
    } else if (key === "所在轄區") {
      // data.所在轄區 = item.所在轄區;
    } else if (key === "X坐標") {
      // data.X坐標 = item.X坐標;
    } else if (key === "Y坐標") {
      // data.Y坐標 = item.Y坐標;
    } else if (key === "公園名稱") {
      data.名稱 = item.公園名稱;
    } else if (key === "里別") {
      data.區域 = item.里別;
    } else if (key === "面積公頃") {
      data.面積 = item.面積公頃;
    } else if (key === "公園全景") {
    } else if (key === "類別") {
      data.類別 = item.類別;
    } else if (key === "座落位置") {
      data.位置 = item.座落位置;
    } else if (key === "管理單位") {
    } else if (key === "使用分區") {
    } else if (item[key] !== "") {
      data.設施 += key + ",";
      // console.log(key, item[key]);
    }
  }
  return data;
});
// console.log(TainanMap);




const TaipeiMap = Taipei.map((item) => {
  const data = {
    名稱: item.Col1,
    簡介: item.Col2,
    介紹: "",
    lng: item.Col3,
    lat: item.Col4,
    設施: "",
    縣市: "台北市",
    區域: item.Col11,
    位置: item.Col7,
    navi: "",
    便利商店: [],
    段落: [],
    停車場: [],
    廁所: [],
    附近美食: [],
  };
  if (item.Col13) data.設施 += item.Col13 + ",";
  if (item.Col14) data.設施 += item.Col14 + ",";
  if (item.Col15) data.設施 += item.Col15 + ",";
  if (item.Col24) data.設施 += item.Col24 + ",";
  return data;
});


// 屏東
// 轉換成陣列
const PingtungMap = Object.keys(Pingtung).map((key) => {
  const data = {
    名稱: Pingtung[key].name,
    簡介: Pingtung[key].Introduction,
    介紹: Pingtung[key].introduce || "",
    lng: Pingtung[key].lng,
    lat: Pingtung[key].lat,
    設施: "",
    縣市: "屏東縣",
    區域: "",
    位置: "",
    navi: Pingtung[key].navi || "",
    便利商店: Pingtung[key].便利商店 || [],
    段落: Pingtung[key].段落 || [],
    停車場: Pingtung[key].停車場 || [],
    廁所: Pingtung[key].廁所 || [],
    附近美食: Pingtung[key].附近美食 || [],
  };
  return data;
});
// console.log(TaipeiMap);

// console.log(PingtungMap);


const merge = [...PingtungMap, ...TainanMap, ...TaipeiMap]
// PingtungMap.forEach(item => merge.push(item))
const mergeMap = merge.map((item, index) => {
  return {
    // id: "ID" + index,
    id: item.縣市 + item.名稱,
    ...item,
  }
})
console.log(mergeMap)




const firebaseApp = initializeApp(getFirebaseConfig());

// 轉換成陣列
// const locations = Object.keys(funMap).map((key) => funMap[key]);


export const locationStore = defineStore('locationStore', {
  state: () => ({
    counter: 0,
    funparks: null, //{}
    locations: mergeMap, //[]
    search: "",
    currentID: "",
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
    increment () {
      this.counter++
    },
    set_search (val) {
      this.search = val
    },
    set_current_Id (val) {
      this.currentId = val
    },
    // 更新公園資料，這個function用不到

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

    // 存入資料
    async saveFunpark (payload) {
      console.log(payload.data)
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
      console.log(payload.data)
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
        console.log(findKey);
        const newImageRef = StorageRef(getStorage(), findKey);
        const fileSnapshot = await uploadBytes(newImageRef, payload.files);
        // 3 - Generate a public URL for the file.
        const publicImageUrl = await getDownloadURL(newImageRef);
        console.log(publicImageUrl)
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

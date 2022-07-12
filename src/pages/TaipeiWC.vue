<template>
  <q-page style="z-index: 1; max-width: 800px">
    <!-- List選項 -->
    <q-btn label="全部寫入資料庫" @click="writeTofirestore" />

    <q-list bordered separator>
      <q-infinite-scroll @load="loadMore" :offset="500">
        <div v-for="(item, key) in showingData" :key="key">
          <q-item v-if="item.廁所">
            <q-item-section @click="showMap(item)">
              <q-item-label class="text-h6"
                >{{ item.名稱 }}
                <q-btn label="單筆寫入" @click="updateDB(item)" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-infinite-scroll>
    </q-list>
    <!-- 彈出地圖視窗 -->
    <q-dialog
      v-model="dialogMap"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-grey-1 text-white">
        <q-bar>
          <q-btn
            flat
            icon="close"
            class="bg-black text-white"
            @click="dialogMap = false"
            >離開
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <q-space />
        </q-bar>

        <q-card-section>
          <!-- 顯示地圖 -->
          <div class="q-ma-md">
            <CMap :locations="data.locations" :center="data.center"></CMap>
          </div>
        </q-card-section>
        <q-card-section>
          <div v-for="(item, key) in data.locations" :key="key">
            <div v-if="key > 0" class="text-h6 text-black">
              {{ item.標題 }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed, toRefs, watchEffect, onMounted } from "vue";
import Taipei from "../assets/Taipei";
import 台北市公廁 from "../assets/台北市公廁";
import CMap from "src/components/Surrounding/CMap";
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
  writeBatch,
} from "firebase/firestore";

const TaipeiMap = Taipei.map((item) => {
  const data = {
    id: "台北市" + item.Col1,
    名稱: item.Col1,
    lng: item.Col3,
    lat: item.Col4,
  };
  return data;
});

TaipeiMap.forEach((item) => {
  // if (item.名稱 === "丹鳳公園") {
  item.廁所 = [];
  台北市公廁.forEach((elm) => {
    let dis = GetDistance(item.lat, item.lng, elm.緯度, elm.經度);

    if (dis <= 0.2) {
      // console.log(item, elm.緯度, elm.經度);
      // console.log(elm.公廁名稱, dis, elm.緯度, ",", elm.經度);
      item.廁所.push({
        標題: elm.公廁名稱,
        距離: dis * 1000,
        lat: elm.緯度,
        lng: elm.經度,
        內容: "",
        照片: [],
        navi: "",
      });
      // console.log(item);
    }
  });
});

// 方法定义 lat,lng
function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = (lat1 * Math.PI) / 180.0;
  var radLat2 = (lat2 * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137; // EARTH_RADIUS; //公尺   //  6378.137 公里
  // s = Math.round(s * 10000) / 10000;
  s = Math.round(s * 10000) / 10000;
  // s = s.toFixed(4);
  return s;
}
// 调用 return的距离单位为km
// console.log(TaipeiMap);

// 捲動分頁載入
const timer = null;
let start = 0;
let offset = 3;
let actualPosition = ref(3);
const showingData = computed(() => {
  return TaipeiMap.slice(0, actualPosition.value);
});
function loadMore(index, done) {
  if (
    // 一開始還沒讀入資料庫RepairCases.length = 0
    TaipeiMap.length != 0 &&
    actualPosition.value > TaipeiMap.length
  )
    return;
  const timer = setTimeout(() => {
    //分段取得累計值
    actualPosition.value += offset;
    done(timer);
  }, 100);
}
function done(timer) {
  clearTimeout(timer);
}

const dialogMap = ref(false);
const data = reactive({
  locations: [],
  center: {},
});

// 顯示在地圖上
function showMap(location) {
  dialogMap.value = true;
  // console.log(location);
  const iconBase = "https://maps.google.com/mapfiles/kml/pal2/";
  // 用公園當中心點
  data.center = {
    lat: location.lat,
    lng: location.lng,
    zoom: 18,
  };
  // 先把公園當作一個點位
  data.locations = [
    {
      標題: location.名稱,
      position: new google.maps.LatLng(data.center.lat, data.center.lng),
      icon: {
        url: iconBase + "icon4.png",
        scaledSize: new google.maps.Size(50, 50),
      },
    },
  ];

  // 加入周邊的廁所
  if (location.廁所) {
    location.廁所.forEach((element) => {
      const wc = {
        標題: element.公廁名稱,
        position: new google.maps.LatLng(element.lat, element.lng),
        icon: {
          url: iconBase + "icon1.png",
          scaledSize: new google.maps.Size(50, 50),
        },
        距離: element.距離,
        navi: "",
      };
      data.locations.push(wc);
    });
  }
}

// 寫入資料庫
function writeTofirestore() {
  TaipeiMap.forEach((item) => {
    // console.log(item);
    updateDB(item);
  });
}

async function updateDB(location) {
  const cityRef = doc(getFirestore(), "FunParks", location.id);
  const data = { 廁所: location.廁所 }; //資料必須是物件格式
  console.log(location.id, data);
  // 更新廁所資料
  updateDoc(cityRef, data);
}
</script>

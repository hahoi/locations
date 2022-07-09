<!--  -->
<template>
  <div class="">
    <div id="map1" ref="mapref1"></div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { locationStore } from "stores/location";

const store = locationStore();

const props = defineProps({
  locations: Array,
});

const mapref1 = ref(null);
//自定義的svgMarker
const svgMarker = {
  path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
  fillColor: "blue",
  fillOpacity: 0.6,
  strokeWeight: 0,
  rotation: 0,
  scale: 2,
  // anchor: new google.maps.Point(15, 30),
};

//從遠端網址設定 Marker 的圖標
const iconBase = {
  path: "https://maps.google.com/mapfiles/kml/pal2/icon4.png",
};

onMounted(() => {
  // console.log(props.locations);
  initMap();
});

function initMap() {
  let info_window = null;

  // const loader = new Loader({
  //   apiKey: "AIzaSyBzSM_IQVJIMVd8L-8pLnCKFQPSi-E7x2w",
  //   version: "weekly",
  // });

  // loader.load().then(() => {
  //地圖設定
  const map1 = new google.maps.Map(mapref1.value, {
    // center: { lat: 22.51482939128582, lng: 120.64367275188368 },
    center: { lat: 23.855211, lng: 120.922269 },

    // 設定地圖縮放比例 0-20
    zoom: 8,
    // 設定是否呈現右下角街景小人
    streetViewControl: false,
    // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
    mapTypeControl: false,
  });

  //建立多個地標
  const markers = props.locations.map((location, i) => {
    const marker = new google.maps.Marker({
      // position: location.coords,
      position: {
        lat: location.lat, // lat,lng Number 格式
        lng: location.lng,
      },
      // label: location.title,
      // title: location.name,
      map: map1,
      icon: "https://maps.google.com/mapfiles/kml/pal2/icon4.png",
    });
    // console.log(location.lat, location.lng);
    if (checkType(location.lat) !== "number") {
      console.log(location.id, "經緯度不是數字格式");
      return;
    }
    if (!location.lat || !location.lng) {
      console.log(location.id, location.lat, location.lng);
      return;
    }
    //彈跳說明視窗
    const infowindow = new google.maps.InfoWindow({
      content: `
          <div id="content">
            <p class="text-h6 text-brown">${location.名稱}</p>
          </div>
          <a href="${location.navi}" target="_blank"><span class="text-h6">導航</span></a>
        `,
      maxWidth: 200,
    });

    marker.addListener("click", () => {
      // 如果目前有開啟中的訊息視窗，先將其關閉
      if (info_window) info_window.close();
      // 顯示被點擊地標的訊息視窗
      infowindow.open(map1, marker);
      // 存入目前開啟的訊息視窗
      info_window = infowindow;
    });

    return marker;
  });

  //聚類標記
  new MarkerClusterer({ map1, markers });
  //   }); //end loader
}
function checkType(data) {
  var toString = Object.prototype.toString;
  var dataType = toString
    .call(data)
    .replace(/\[object\s(.+)\]/, "$1")
    .toLowerCase();
  return dataType; // 返回的是字串 'object' 'string' .... 都是小寫
}
</script>
<style>
#map1 {
  width: 100%;
  height: calc(100vh - 126px);
}
</style>

<!--  -->
<template>
  <div class="">
    <div id="map" ref="mapref"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import MarkerClusterer from "@googlemaps/markerclustererplus";

const mapref = ref(null);
const locations = [
  {
    title: "屏東市體育館",
    address1: "屏東市勝利路9號",
    coords: { lat: 22.67770177453158, lng: 120.49384552694531 },
    Crowd_state: 5,
  },
  {
    title: "屏東市大同高中",
    address1: "屏東市和平路429號",
    coords: { lat: 22.678487306792487, lng: 120.47765765560953 },
    Crowd_state: 3,
  },
  {
    title: "潮州鎮潮州高中",
    address1: "潮州鎮中山路11號",
    coords: { lat: 22.54957401199959, lng: 120.54529776056609 },
    Crowd_state: 1,
  },
];
//---------- data ----------
const data = reactive({
  map: null,
});
initMap();
function initMap() {
  const loader = new Loader({
    apiKey: "AIzaSyBzSM_IQVJIMVd8L-8pLnCKFQPSi-E7x2w",
    version: "weekly",
  });

  loader.load().then(() => {
    data.map = new google.maps.Map(mapref.value, {
      center: { lat: 22.51482939128582, lng: 120.64367275188368 },
      // 設定地圖縮放比例 0-20
      zoom: 9,
      // 設定是否呈現右下角街景小人
      streetViewControl: false,
      // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
      mapTypeControl: false,
    });
    //建立多個地標
    const markers = locations.map((location, i) => {
      return new google.maps.Marker({
        position: location.coords,
        // label: location.title,
        title: location.title,
        map: data.map,
      });
    });

    //聚類標記
    // new MarkerClusterer(data.map, markers, {
    //   imagePath:
    //     "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    // });
  }); //end loader
}
</script>
<style>
#map {
  width: 100%;
  height: calc(100vh - 126px);
}
</style>

<!--  -->
<template>
  <div class="">
    <div id="map2" ref="mapref2"></div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from "vue";
// import { Loader } from "@googlemaps/js-api-loader";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";

const props = defineProps({
  center: Object,
  locations: Array,
});

const mapref2 = ref(null);
let map2;
let info_window = null;

function initMap() {
  map2 = new google.maps.Map(mapref2.value, {
    center: new google.maps.LatLng(props.center.lat, props.center.lng),
    zoom: props.center.zoom,
  });

  // Create markers.
  // for (let i = 0; i < features.length; i++) {
  //   const marker = new google.maps.Marker({
  //     position: features[i].position,
  //     icon: icons[features[i].type].icon,
  //     map: map,
  //   });
  // }
  // props.locations.forEach((location) => {
  //   const marker = new google.maps.Marker({
  //     position: location.position,
  //     icon: location.icon,
  //     label: location.title,
  //     map: map,
  //   });
  // });
  // console.log(props.locations);

  //建立多個地標
  const markers = props.locations.map((location, i) => {
    const marker = new google.maps.Marker({
      position: location.position,
      label: location.標題,
      map: map2,
      icon: location.icon,
      labelClass: "labels",
    });

    //彈跳說明視窗
    let content = "";
    if (location.navi) {
      content = `
          <div id="content">
            <p class="text-h6 text-brown">${location.標題}</p>
          <a href="${location.navi}" target="_blank"><span class="text-h6">導航</span></a>
          </div>
        `;
    } else {
      content = `
          <div id="content">
            <p class="text-h6 text-brown">${location.標題}</p>
          </div>
        `;
    }

    const infowindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 300,
    });

    marker.addListener("click", () => {
      // 如果目前有開啟中的訊息視窗，先將其關閉
      if (info_window) info_window.close();
      // 顯示被點擊地標的訊息視窗
      infowindow.open(map2, marker);
      // 存入目前開啟的訊息視窗
      info_window = infowindow;
    });

    return marker;
  });
}

onMounted(() => {
  // console.log(props.locations);
  initMap();
});
</script>
<style>
#map2 {
  width: 100%;
  /* height: calc(100vh - 126px); */
  height: calc(60vh);
}
.labels {
  color: red;
}
</style>

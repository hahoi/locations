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

let center = {
  lat: 22.532781,
  lng: 120.538236,
  zoom: 15,
};
const placeId = [];

function initMap() {
  map2 = new google.maps.Map(mapref2.value, {
    center: new google.maps.LatLng(center.lat, center.lng),
    zoom: center.zoom,
  });

  var request = {
    location: new google.maps.LatLng(center.lat, center.lng),
    radius: "800",
    type: ["restaurant"],
  };
  const service = new google.maps.places.PlacesService(map2);
  service.nearbySearch(request, callback);

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        console.log(results[i]);
        // createMarker(results[i]);
        placeId.push(results[i]);
      }
      fetchPlaceDetails();
    }
  }

  function fetchPlaceDetails() {
    const service = new google.maps.places.PlacesService(map2);
    // service.getDetails(request, callback);
    placeId.forEach((item) => {
      var request = {
        placeId: item.place_id,
        fields: [
          "name",
          "types",
          "geometry.location",
          "formatted_address",
          "photo",
          "url",
          "website",
          "formatted_phone_number",
          "opening_hours",
          "rating",
          "user_ratings_total",
          "price_level",
          "review",
        ],
      };
      service.getDetails(request, callback);

      function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log(place);
          // createMarker(place);
        }
      }
    });
  }

  /*
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
*/
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

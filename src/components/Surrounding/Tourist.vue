<template>
  <q-page>
    <div class="" style="display: none">
      <div id="map2" ref="mapref2"></div>
    </div>
    <div v-if="data.dataReady">
      <restaurant :center="data.center" :placeId="data.placeId"></restaurant>
    </div>
  </q-page>
</template>
<script setup>
// icon32

import restaurant from "src/components/Surrounding/Gmplace/restaurant.vue";

import { ref, reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { locationStore } from "stores/location";

const router = useRouter();
const route = useRoute();

const id = route.params.parkId;
const store = locationStore();
const location = store.locationsFilteredArray.find((item) => id == item.id);

if (!location) {
  // console.log(location);
  router.push("/").catch((err) => {});
}

const mapref2 = ref(null);

const data = reactive({
  // 用公園當中心點
  center: {
    lat: location.lat,
    lng: location.lng,
  },
  placeId: [],
  dataReady: false,
});

onMounted(() => {
  initMap();
});

function initMap() {
  const map2 = new google.maps.Map(mapref2.value, {
    center: new google.maps.LatLng(data.center.lat, data.center.lng),
  });

  var request = {
    location: new google.maps.LatLng(data.center.lat, data.center.lng),
    radius: "2000", //2公里景點
    type: ["tourist_attraction"],
  };
  const service = new google.maps.places.PlacesService(map2);
  service.nearbySearch(request, callback);

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        // createMarker(results[i]);
        // console.log(results[i]);
        data.placeId.push({ placeId: results[i].place_id });
      }
      // console.log(data.placeId);
      data.dataReady = true;
    }
  }
}
</script>

<template>
  <q-page>
    <div class="" style="display: none">
      <div id="map2" ref="mapref2"></div>
    </div>
    <div v-if="data.dataReady">
      <gmplace :center="data.center" :placeId="data.placeId"></gmplace>
    </div>
  </q-page>
</template>
<script setup>
// icon32

import gmplace from "src/components/Surrounding/Gmplace/gmPlace";

import { ref, reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { locationStore } from "stores/location";

const props = defineProps({
  location: Object,
  radius: String, //"2000",
  type: Array,
});
// 搜尋種類網址
// https://developers.google.com/maps/documentation/javascript/supported_types

const router = useRouter();
const route = useRoute();

const id = route.params.parkId;
const store = locationStore();
const location = store.locationsFilteredArray.find((item) => id == item.id);

// 設定fab展開
const fab1 = ref(true);
const hideLabels = ref(false);

// if (!location) {
//   // console.log(location);
//   router.push("/").catch((err) => {});
// }

const mapref2 = ref(null);

const data = reactive({
  // 用公園當中心點
  center: {
    lat: 22.532781,
    lng: 120.538236,
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
    location:
      props.location ||
      new google.maps.LatLng(data.center.lat, data.center.lng),
    radius: props.radius || "10000",
    type: ["tourist_attraction"],
    // type: props.tyge || ["parking"],
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

<template>
  <div class="q-ma-md">
    <CMap :locations="locations" :center="center"></CMap>
  </div>
</template>
<script setup>
import CMap from "./CMap.vue";
import { useRouter, useRoute } from "vue-router";
import { locationStore } from "stores/location";
const router = useRouter();
const route = useRoute();

const id = route.params.parkId;
const store = locationStore();
const location = store.locationsFilteredArray.find((item) => id == item.id);

console.log(location);
const iconBase = "https://maps.google.com/mapfiles/kml/pal2/";
// 用公園當中心點
const center = {
  lat: location.lat,
  lng: location.lng,
  zoom: 13,
};
// 先把公園當作一個點位
const locations = [
  {
    title: location.名稱,
    position: new google.maps.LatLng(center.lat, center.lng),
    icon: {
      url: iconBase + "icon4.png",
      scaledSize: new google.maps.Size(50, 50),
    },
    navi: location.navi,
  },
];
// 加入周邊的便利商店
if (location.便利商店 !== undefined) {
  location.便利商店.forEach((element) => {
    const data = {
      title: element.title,
      position: new google.maps.LatLng(element.lat, element.lng),
      icon: {
        url: iconBase + "icon19.png",
        scaledSize: new google.maps.Size(50, 50),
      },
      navi: element.navi,
    };
    locations.push(data);
  });
}
</script>

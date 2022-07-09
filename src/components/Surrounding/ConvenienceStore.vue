<template>
  <div>
    <div class="q-ma-md">
      <CMap :locations="locations" :center="center"></CMap>
    </div>
    <template
      v-if="location.便利商店"
      v-for="(item, key) in location.便利商店"
      class="q-pa-md row items-start q-gutter-md"
    >
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="text-h6" v-html="item.標題"></div>

          <div class="text-subtitle1" v-html="item.內容"></div>
          <div v-for="(img, key) in item.照片" v-if="item.照片">
            <q-img
              contain
              spinner-color="white"
              :src="img.url"
              @click="previewImgObject(img.url)"
              style="border-radius: 3%/5%; max-width: 300px"
              class="q-ma-md"
            >
            </q-img>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </div>
</template>
<script setup>
// npm install v-viewer@next
import "viewerjs/dist/viewer.css";
import { api as viewerApi } from "v-viewer";

import CMap from "./CMap.vue";
import { useRouter, useRoute } from "vue-router";
import { locationStore } from "stores/location";
const router = useRouter();
const route = useRoute();

const id = route.params.parkId;
const store = locationStore();
const location = store.locationsFilteredArray.find((item) => id == item.id);

// console.log(location);
const iconBase = "https://maps.google.com/mapfiles/kml/pal2/";
// 用公園當中心點
const center = {
  lat: location.lat,
  lng: location.lng,
  zoom: 14,
};
// 先把公園當作一個點位
const locations = [
  {
    標題: location.名稱,
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
      標題: element.標題,
      position: new google.maps.LatLng(element.lat, element.lng), // lat,lng 字串格式
      icon: {
        url: iconBase + "icon19.png",
        scaledSize: new google.maps.Size(50, 50),
      },
      navi: element.navi,
    };
    locations.push(data);
  });
}

function previewImgObject(url) {
  // console.log([url]);
  const $viewer = viewerApi({
    options: {
      title: false,
    },
    images: [url], //必須是陣列map
  });
}
</script>

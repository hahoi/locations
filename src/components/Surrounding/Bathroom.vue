<template>
  <div>
    <template
      v-if="location.廁所"
      v-for="(item, key) in location.廁所"
      class="q-pa-md row items-start q-gutter-md"
    >
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="text-h6" v-html="item.標題"></div>
        </q-card-section>

        <q-card-section class="row q-pt-none">
          <div
            class="text-subtitle1 col-sm-6 col-xs-12"
            v-html="item.內容"
          ></div>
          <div class="col-sm-6 col-xs-12" v-if="item.照片">
            <q-img
              contain
              spinner-color="white"
              :src="item.照片.url"
              @click="previewImgObject(item.照片.url)"
              style="border-radius: 3%/5%; max-width: 300px"
            >
              <div
                class="absolute-bottom-left text-subtitle2"
                v-if="item.照片.簡介 != ''"
              >
                {{ item.照片.簡介 }}
              </div>
            </q-img>
          </div>
        </q-card-section>
      </q-card>
    </template>
    <div class="q-ma-md">
      <CMap :locations="locations" :center="center"></CMap>
    </div>
  </div>
</template>
<script setup>
// icon1
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
  zoom: 18,
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
// 加入周邊的廁所
if (location.廁所 !== undefined) {
  location.廁所.forEach((element) => {
    const data = {
      title: element.title,
      position: new google.maps.LatLng(element.lat, element.lng),
      icon: {
        url: iconBase + "icon1.png",
        scaledSize: new google.maps.Size(50, 50),
      },
      navi: element.navi,
    };
    locations.push(data);
  });
}
</script>

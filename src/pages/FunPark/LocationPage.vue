<template>
  <q-page style="max-width: 800px; margin: auto">
    <q-tabs v-model="data.tab" align="justify" narrow-indicator class="">
      <q-tab class="text-info" name="TabList" label="好玩公園" />
      <q-tab class="text-orange" name="TabMap" label="公園地圖" />
    </q-tabs>

    <q-tab-panels
      v-model="data.tab"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="text-white text-center"
    >
      <q-tab-panel name="TabList" class="text-blue text-left">
        <!-- <div class="row flex justify-around text-white"></div> -->
        <TabList :locations="locationsFilteredArray"></TabList>
      </q-tab-panel>
    </q-tab-panels>

    <q-tab-panels
      v-model="data.tab"
      animated
      transition-prev="fade"
      transition-next="fade"
      class="text-white text-center"
    >
      <q-tab-panel name="TabMap">
        <TabMap :locations="locationsFilteredArray"></TabMap>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, reactive, toRefs, computed } from "vue";
import { locationStore } from "stores/location";
import TabList from "src/components/TabList";
import TabMap from "src/components/TabMap";
// import funMap from "src/assets/funMap.js";

//---------- data ----------
const data = reactive({
  // locations: [],
  map: [],
  tab: "TabList",
});

// data.locations = Object.keys(funMap).map((key) => funMap[key]);

const store = locationStore();
// console.log("store locationsFiltered", store.locationsFiltered);
const locationsFiltered = computed(() => store.locationsFiltered); // 響應式

const locationsFilteredArray = computed(() => store.locationsFilteredArray); // 響應式
// getdata();

// async function getdata() {
//   await store.queryfunparks();
//   // console.log(store.funparks);

//   data.map = Object.keys(store.funparks).map((key) => {
//     // console.log(key, store.funparks[key]);
//     let t = store.funparks[key];
//     return {
//       address: t.address,
//       name: t.title,

//       // 存檔用
//       // let coords = new firebase.firestore.GeoPoint(lat, lng);
//       //Firestore.GeoPoint 轉換
//       lat: t.coords.latitude,
//       lng: t.coords.longitude,
//       // naveUrl: t.naveUrl
//     };
//   });
//   // console.log(data.map);
// }
</script>

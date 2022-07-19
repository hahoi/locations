<!--  -->
<template>
  <q-page class="">
    <TabMap :locations="locationsFilteredArray"></TabMap>
  </q-page>
</template>

<script setup>
import { ref, reactive, toRefs, computed, onMounted } from "vue";
import { locationStore } from "stores/location";

import TabMap from "src/components/TabMap";

const store = locationStore();
const locationsFilteredArray = store.locationsFilteredArray;
if (!store.locationDataReady) {
  store.queryFunParks();
}

onMounted(() => {});
</script>
<style></style>

<template>
  <div>
    <q-input
      clearable
      color="secondary"
      v-model="searchField"
      label="全文查詢，多個關鍵字用空白隔開"
      @keyup.esc="searchField = ''"
      outlined
      class=""
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, toRefs } from "vue";
import { locationStore } from "stores/location";

//---------- pinia ----------
const store = locationStore();

const searchField = computed({
  get: () => {
    return store.search;
  },
  set: (val) => {
    let str = val || "";
    store.set_search(str);
  },
});
</script>

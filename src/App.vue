<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { locationStore } from "stores/location";

export default defineComponent({
  name: "App",
  setup() {
    const store = locationStore();
    // store.set_normalRouter(true);
  },
});
</script>

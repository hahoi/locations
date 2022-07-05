<template>
  <q-page class="flex flex-center">
    <h5>首頁介紹資訊，待補充........</h5>
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import { locationStore } from "stores/location";

export default defineComponent({
  name: "IndexPage",
  setup(props, context) {
    const router = useRouter();

    // router.replace("/funpark").catch((err) => {});
    return {};
  },
});
</script>

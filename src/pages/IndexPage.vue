<template>
  <q-page class="flex flex-center">
    <img
      alt="好玩的公園"
      src="~assets/fun-park_.png"
      style="width: 200px; height: 200px"
    />

    <q-btn
      fab
      icon="keyboard_arrow_up"
      color="white"
      size="sm"
      @click="$router.push('/mana')"
      style="position: absolute; bottom: 58px; right: 18px"
    />

    <q-page-sticky position="bottom" :offset="[0, 0]">
      <q-icon
        name="get_app"
        color="green"
        style="font-size: 4rem"
        class="animated animate__shakeY"
      />
    </q-page-sticky>
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
<style scoped>
/* 更改 特定 的動畫持續時間 */
.animate__fadeInDown {
  /* --animate-duration: 0.5s; */
}
.animate__shakeY {
  /* --animate-duration: 0.5s;
  --animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite; */
}
</style>

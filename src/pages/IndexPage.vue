<template>
  <q-page class="">
    <div class="text-center q-pa-md" style="position: relative; height: 80vh">
      <div><h5>親子對好玩公園的搜尋需求</h5></div>
      <div><h5>搜尋引擎如何解決問題</h5></div>
      <div><h5>可複製，未來能延伸到全國各點特色公園</h5></div>

      <q-parallax :height="150">
        <template v-slot:media>
          <video
            width="720"
            height="440"
            poster="https://cdn.quasar.dev/img/polina.jpg"
            autoplay
            loop
            muted
          >
            <source
              type="video/webm"
              src="https://cdn.quasar.dev/img/polina.webm"
            />
            <source
              type="video/mp4"
              src="https://cdn.quasar.dev/img/polina.mp4"
            />
          </video>
        </template>

        <h3 class="text-white">Video</h3>
      </q-parallax>
    </div>
    <!-- 回到頂端 -->

    <q-btn
      fab
      icon="keyboard_arrow_up"
      color="white"
      size="sm"
      @click="$router.push('/mana')"
      style="position: absolute; bottom: 58px; right: 18px"
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

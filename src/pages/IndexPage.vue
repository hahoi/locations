<template>
  <q-page class="">
    <div
      class="text-center"
      style="position: relative; height: 80vh; max-width: 800px; margin: 0 auto"
    >
      <div class="text-h5 q-ma-md">現代孩子打發時間方式</div>

      <div class="row justify-center" style="position: relative">
        <div
          class="col-sm-6 col-xs-12"
          style="
            background-image: url(/img/img4.jpg);
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            filter: brightness(30%);
          "
        ></div>
        <div
          class="col-sm-6 col-xs-12"
          style="
            background-image: url(/img/img5.jpg);
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            filter: brightness(50%);
          "
        ></div>
        <div
          class="row text-center text-h5 text-white full-height items-center justify-center"
          style="position: absolute; top: 10px"
        >
          <p class="q-ma-md col-xs-12 col-sm-4">缺少活動</p>
          <p class="q-ma-md col-xs-12 col-sm-4">視力受到影響</p>
          <p class="q-ma-md col-xs-12 col-sm-4">沉迷3C世界</p>
        </div>
      </div>

      <div class="q-ma-md">
        <span class="text-h5">孩子需要的是</span>
        <span class="text-h4">奔跑</span>
      </div>
      <div
        class="col-sm-12 col-xs-12"
        style="
          background-image: url(/img/img5.jpg);
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
          filter: brightness(50%);
        "
      >
        <div><h5>搜尋引擎如何解決問題</h5></div>
        <div><h5>可複製，未來能延伸到全國各點特色公園</h5></div>

        <!-- <q-parallax :height="150">
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
      </q-parallax> -->
      </div>
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
<style lang="sass" scoped>
.row > div
  padding: 10px 15px
  height: 20vh
.row + .row
  margin-top: 1rem
</style>
<!-- background: rgba(86,61,124,.15) -->
<!-- border: 1px solid rgba(86,61,124,.2) -->

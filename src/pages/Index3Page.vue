<template>
  <q-page>
    <div
      class="text-center"
      style="
        position: relative;
        height: 89vh;
        max-width: 800px;
        margin: 0 auto;
        background-image: linear-gradient(
          0deg,
          rgba(25, 136, 247, 0.51) 0%,
          rgba(247, 25, 136, 0.36) 100%
        );
      "
    >
      <div class="text-h5 row justify-center items-end" style="height: 6vh">
        <span class="text-lime-10" style="text-shadow: 1px 1px 1px #bbbbbb">
          現代孩子打發時間方式
        </span>
      </div>

      <div class="row justify-center" style="position: relative">
        <div
          class="col-6"
          style="
            background-image: url(/img/img4.jpg);
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            filter: brightness(20%);
            border-radius: 3% 0 0 3%;
            height: 28vh;
          "
        ></div>
        <div
          class="col-6"
          style="
            background-image: url(/img/img5.jpg);
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            filter: brightness(30%);
            border-radius: 0 3% 3% 0;
            height: 28vh;
          "
        ></div>
        <div
          class="row text-h5 text-blue-grey-2 full-width items-center justify-center"
          style="position: absolute; top: 10px; height: 28vh"
        >
          <p class="col-12">缺少活動</p>
          <p class="col-12">視力受到影響</p>
          <p class="col-12">沉迷3C世界</p>
        </div>
      </div>

      <div class="row items-end justify-center" style="height: 6vh">
        <span class="text-h5 text-teal"><b>孩子需要的是</b></span>
        <span class="text-h4 text-teal" style="text-shadow: 1px 1px 1px #bbbbbb"
          ><b>奔跑</b></span
        >
      </div>

      <div class="row justify-center" style="position: relative">
        <div
          class="full-width"
          style="
            background-image: url(/img/img1.png);
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            filter: brightness(30%);
            border-radius: 3%/5%;
            height: 28vh;
          "
        ></div>
        <div
          class="row text-h5 text-brown-2 full-width items-center justify-center"
          style="position: absolute; top: 10px; height: 28vh"
        >
          <p class="col-12">促進親子感情</p>
          <p class="col-12">促進孩子探索</p>
          <p class="col-12">釋放孩子精力</p>
        </div>
      </div>

      <div
        class="row text-h5 full-width items-center justify-center"
        style="height: 8vh"
      >
        <span class="col-12" style="text-shadow: 1px 1px 5px #bbbbbb"
          ><b class="text-green-8">好玩公園資訊哪裡找？</b></span
        >
        <q-icon
          name="get_app"
          color="green-8"
          style="font-size: 4rem; position: absolute; bottom: 0px"
          class="animated animate__shakeY text-center"
        />
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

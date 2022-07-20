<template>
  <q-page>
    <div
      class="text-center"
      style="
        position: relative;
        height: calc(100vh - 100px);
        max-width: 800px;
        margin: 0 auto;
        background-image: linear-gradient(
          0deg,
          rgba(25, 136, 247, 0.51) 0%,
          rgba(247, 25, 136, 0.36) 100%
        );
      "
    >
      <div class="text-h5 row justify-center items-end" style="height: 6%">
        <span class="text-lime-10" style="text-shadow: 1px 1px 1px #bbbbbb">
          現代孩子打發時間方式
        </span>
      </div>

      <div class="row justify-center" style="position: relative; height: 30%">
        <div
          class="col-12 full-height"
          style="
            background-image: url(/img/01-1.jpg);
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            filter: brightness(70%);
            border-radius: 3% 0 0 3%;
            /* height: 30%; */
          "
        ></div>

        <div
          class="row text-h5 text-black full-width full-height items-center justify-end"
          style="position: absolute"
        >
          <div
            class="text-right"
            style="
              background-color: rgba(171, 174, 177, 0.7);
              border-radius: 12px;
              box-shadow: 2px 2px 12px 4px rgba(0, 0, 0, 0.1);
            "
          >
            <p class="col-6">缺少活動</p>
            <p class="col-6">沉迷3C世界</p>
            <p class="col-6">視力受到影響</p>
          </div>
        </div>
      </div>

      <div class="row items-end justify-center" style="height: 8%">
        <span class="text-h5 text-teal"><b>孩子需要的是</b></span>
        <span class="text-h4 text-teal" style="text-shadow: 1px 1px 1px #bbbbbb"
          ><b>奔跑</b></span
        >
      </div>

      <div class="row justify-center" style="position: relative; height: 30%">
        <div
          class="full-width full-height"
          style="
            background-image: url(/img/02-1.jpg);
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            /* filter: brightness(30%); */
            border-radius: 3%/5%;
            /* height: 30%; */
          "
        ></div>
        <div
          class="row text-h5 text-black full-width full-height items-center justify-start"
          style="position: absolute"
        >
          <div
            class="text-left"
            style="
              background-color: rgba(158, 207, 113, 0.6);
              border-radius: 12px;
              box-shadow: 2px 2px 12px 4px rgba(0, 0, 0, 0.1);
            "
          >
            <p class="col-6">釋放孩子精力</p>
            <p class="col-6">促進孩子探索</p>
            <p class="col-6">促進親子感情</p>
          </div>
        </div>
      </div>

      <div
        class="row text-h5 full-width items-center justify-center"
        style="height: 16%"
      >
        <span class="col-12" style="text-shadow: 1px 1px 5px #bbbbbb"
          ><b class="text-green-8">好玩公園資訊哪裡找？</b></span
        >
        <q-icon
          name="get_app"
          color="green-8"
          style="font-size: 4rem"
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
      style="position: absolute; bottom: 38px; right: 18px"
    />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import { locationStore } from "stores/location";

export default defineComponent({
  name: "IndexPage",
  setup(props, context) {
    const store = locationStore();

    const router = useRouter();
    const route = useRoute();

    // store.set_dataReady(false);
    if (!store.locationDataReady) {
      store.queryFunParks();
    }
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

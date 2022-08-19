<template>
  <q-page>
    <div class="parallax-1 img-1 container">
      <div class="text1">
        <p>現代孩子打發時間方式</p>
        <br />
        <p>沉迷3C世界</p>
        <p>視力受到影響</p>
        <p>缺少活動</p>
      </div>
    </div>
    <div class="parallax-1 img-2 container">
      <div class="text2">
        <p>孩子需要的是</p>
        <p class="text4">奔跑</p>
        <p></p>
      </div>
    </div>
    <div class="parallax-1 img-3 container">
      <div class="text3">
        <p class="text-positive text4">好玩的公園</p>
        <br />
        <p>釋放孩子精力</p>
        <p>促進孩子探索</p>
        <p>促進親子感情</p>
      </div>
    </div>
    <div class="flex row justify-center">
      <q-icon
        name="get_app"
        color="green-8"
        style="font-size: 4rem"
        class="animated animate__shakeY infinite"
      />
    </div>
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
<style scoped>
.bg1 {
  background-image: url(http://mdc.dyu.edu.tw/rwd/images/news/beauty.jpg);
}
.bg2 {
  background-image: url(http://mdc.dyu.edu.tw/rwd/images/news/magpie.jpg);
}
.bg3 {
  background-image: url(http://mdc.dyu.edu.tw/rwd/images/work2d/teacher5.jpg);
}
.bg4 {
  background-image: url(http://mdc.dyu.edu.tw/rwd/images/news/sea.jpg);
}

.parallax-1 {
  /* min-height: 500px; */

  height: 100vh;
  background-attachment: fixed;
  background-position: center center;
  background-size: cover;

  /* width: 500px; */
  margin: 0 auto;
  padding: 40px;

  font-size: 50px;
  line-height: 60px;
}
.img-1 {
  height: 100vh;
  width: 100vw;
  background-image: url("https://funpark.web.app/img/01-1.jpg");
}
.img-2 {
  height: 100vh;
  width: 100vw;
  background-image: url("https://funpark.web.app/img/02-1.jpg");
}
.img-3 {
  height: 100vh;
  width: 100vw;
  /* background-image: url("https://firebasestorage.googleapis.com/v0/b/funpark-96a09.appspot.com/o/FunParks%2F%E5%B1%8F%E6%9D%B1%E7%B8%A3%E6%BD%AE%E5%A5%BD%E7%8E%A9%E5%B9%B8%E7%A6%8F%E6%9D%91%E7%89%B9%E8%89%B2%E9%81%8A%E6%88%B2%E5%A0%B4%2F272338989_307311534686226_8928526493212128050_n.jpg?alt=media&token=6b9e6b4f-0c67-4b8e-a976-784429b947db"); */
  background-image: url("https://funpark.web.app/img/03-1.jpg");
}
.container {
  display: flex;
  margin: 0;
  justify-content: center;
  min-width: 100vw;
  min-height: 100vh;
}
.text1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  /*   line-height: 100px;            */

  color: #fff;
  /* background-color: #232323; */
  text-shadow: 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #49ff18,
    0 0 5px #49ff18, 0 0 5px #49ff18, 0 0 5px #49ff18, 0 0 5px #49ff18;
}

.text2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  /*   line-height: 100px;            */

  color: #fff;
  /* background-color: #232323; */
  text-shadow: 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #ff8000,
    0 0 5px #ff8000, 0 0 5px #ff8000, 0 0 5px #ff8000, 0 0 5px #ff8000;
}
.text4 {
  font-size: 60px;
  line-height: 100px;
}
.text3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  /*   line-height: 100px;            */

  color: #fff;
  /* background-color: #232323; */
  text-shadow: 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #0048ba,
    0 0 5px #0048ba, 0 0 5px #0048ba, 0 0 5px #0048ba, 0 0 5px #0048ba;
}
</style>
<!-- background: rgba(86,61,124,.15) -->
<!-- border: 1px solid rgba(86,61,124,.2) -->

<template>
  <div>
    <q-card flat v-for="(item, key) in park.附近美食">
      <q-card-section class="bg-grey-11 q-mt-lg">
        <div class="row justify-end">
          <q-btn label="刪除" @click="delItem(key)"></q-btn>
        </div>

        <div class="q-ma-md row items-start">
          <q-input
            v-model="item.title"
            label="title"
            class="full-width"
            style="font-size: 18px"
          >
            <template v-slot:append>
              <q-icon name="close" @click="item.title = ''" />
            </template>
          </q-input>
        </div>
        <div class="q-ma-md row items-start">
          <q-input
            v-model="item.lat"
            label="lat 緯度"
            class="full-width"
            style="font-size: 18px"
          >
            <template v-slot:append>
              <q-icon name="close" @click="item.lat = ''" />
            </template>
          </q-input>
        </div>
        <div class="q-ma-md row items-start">
          <q-input
            v-model="item.lng"
            label="lng 經度"
            class="full-width"
            style="font-size: 18px"
          >
            <template v-slot:append>
              <q-icon name="close" @click="item.lng = ''" />
            </template>
          </q-input>
        </div>
        <div class="q-ma-md row items-start">
          <q-input
            v-model="item.navi"
            label="導航"
            class="full-width"
            type="textarea"
            rows="4"
          >
            <template v-slot:append>
              <q-icon name="close" @click="item.navi = ''" />
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>
    <div class="q-ma-md row justify-around">
      <q-btn
        label="新增"
        color="primary"
        class="col-4 text-h6"
        @click="appendBathroom"
      ></q-btn>

      <q-btn
        label="存檔"
        color="positive"
        class="col-4 text-h6"
        @click="SaveToDB"
      ></q-btn>
    </div>
  </div>
</template>
<script setup>
import { onMounted, computed, reactive, ref, toRefs, watchEffect } from "vue";
import { extend } from "quasar";

import { locationStore } from "stores/location";

const store = locationStore();
const props = defineProps({
  location: Object,
});
const park = props.location;
const bathroom = props.location.附近美食;

const blank = {
  title: "",
  lat: 23.855211,
  lng: 120.922269,
  navi: "",
};
const showSaveBtnMsg = ref(false);
const data = reactive({});
// 有輸資料才可以存檔
watchEffect(() => {});

function appendBathroom() {
  park.附近美食.push(extend(true, {}, blank));
}
function delItem(index) {
  park.附近美食.splice(index, 1); // 通过splice 删除数据
}
// 存入資料庫
async function SaveToDB() {
  const payload = {
    id: park.id,
    data: park,
  };
  console.log(payload);
  await store.saveFunpark(payload);
}
</script>

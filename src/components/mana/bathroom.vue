<template>
  <div>
    <q-card flat v-for="(item, key) in park.廁所">
      <q-card-section class="bg-grey-11 q-mt-lg">
        <div class="row justify-end">
          <q-btn label="刪除" @click="delItem(key)"></q-btn>
        </div>

        <div class="q-ma-md row items-start">
          <q-input
            v-model="item.標題"
            label="title"
            class="full-width"
            style="font-size: 18px"
          >
            <template v-slot:append>
              <q-icon name="close" @click="item.標題 = ''" />
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
        <div class="q-ma-md row items-start">
          <q-input
            v-model="item.內容"
            type="textarea"
            rows="2"
            label="內容"
            class="full-width"
          >
            <template v-slot:append>
              <q-icon name="close" @click="item.內容 = ''" />
            </template>
          </q-input>
        </div>

        <!-- 上傳訊息內容圖片 -->
        <div class="q-pa-md">
          <div class="text-center text-negative text-h6">上傳圖片</div>
          <q-icon
            name="photo_camera"
            class="col-1 text-teal"
            style="font-size: 4.4em; width: 50px"
            @click="$refs.mediaCapture.click()"
          />
          <input
            id="mediaCapture"
            ref="mediaCapture"
            type="file"
            accept="image/*"
            capture="camera"
            style="display: none"
            @change="onMediaFileSelected"
          />
        </div>
        <div v-if="item.照片">
          <img
            :src="item.照片.url"
            alt=""
            style="border-radius: 3%/5%; max-width: 100px"
          />
        </div>

        <div class="q-ma-md row items-start" v-if="item.照片">
          <q-input v-model="item.照片.簡介" label="圖片簡介" class="full-width">
            <template v-slot:append>
              <q-icon name="close" @click="item.照片.簡介 = ''" />
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

import { compress, compressAccurately } from "image-conversion";
import {
  getStorage,
  ref as StorageRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { locationStore } from "stores/location";

const store = locationStore();
const props = defineProps({
  location: Object,
});
const park = props.location;
const bathroom = props.location.廁所;

const blank = {
  標題: "",
  lat: park.lat,
  lng: park.lng,
  navi: "",
  內容: "",
  照片: {
    findKey: "",
    url: "",
    簡介: "",
  },
};
const showSaveBtnMsg = ref(false);
const data = reactive({});
// 有輸資料才可以存檔
watchEffect(() => {});

function appendBathroom() {
  park.廁所.push(extend(true, {}, blank));
}
function delItem(index) {
  park.廁所.splice(index, 1); // 通过splice 删除数据
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

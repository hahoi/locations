<template>
  <div>
    <input
      id="mediaCapture"
      ref="mediaCapture"
      type="file"
      accept="image/*"
      capture="camera"
      style="display: none"
      @change="onMediaFileSelected"
    />
    <q-card flat v-for="(item, key) in park.便利商店">
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
          <div class="text-center">
            <q-icon
              name="photo_camera"
              class="col-1 text-teal"
              style="font-size: 4.4em; width: 50px"
              @click="$refs.mediaCapture.click((data.key = key))"
            />
          </div>
        </div>
        <div v-for="(img, index) in item.照片" v-if="item.照片">
          <div class="row justify-center q-ma-xs">
            <q-icon name="close" @click="delImg(key, index)" />
            <img
              :src="img.url"
              alt=""
              style="border-radius: 3%/5%; max-width: 100px"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="q-ma-md row justify-around">
      <q-btn
        label="新增"
        color="primary"
        class="col-4 text-h6"
        @click="appendItem"
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
  deleteObject,
} from "firebase/storage";

import { locationStore } from "stores/location";

const store = locationStore();
const props = defineProps({
  location: Object,
});
const park = props.location;
const bathroom = props.location.便利商店;

const mediaCapture = ref(null);

onMounted(() => {
  // DOM元素在出事渲染后分配给ref
  // console.log(mediaCapture.value);
});

const data = reactive({
  message: {},
  key: "",
});

const blank = {
  標題: "",
  lat: park.lat,
  lng: park.lng,
  navi: "",
  內容: "",
  照片: [
    // {
    //   findKey: "",
    //   url: "",
    // },
  ],
};
const showSaveBtnMsg = ref(false);

function appendItem() {
  park.便利商店.push(extend(true, {}, blank));
  // console.log(park.便利商店);
}

// 刪除item 資料
function delItem(index) {
  // 刪除storage上的照片
  park.便利商店[index].照片.forEach((element) => {
    storageImgDelete(element.findKey);
  });
  park.便利商店.splice(index, 1); // 通过splice 删除数据
}
function delImg(key, index) {
  // console.log(park.便利商店[key].照片[index], key, index);
  // 刪除storage上的照片
  storageImgDelete(park.便利商店[key].照片[index].findKey);
  park.便利商店[key].照片.splice(index, 1);
}

function storageImgDelete(findKey) {
  const storage = getStorage();
  // console.log(findKey);

  const desertRef = StorageRef(storage, findKey);

  // Delete the file
  deleteObject(desertRef)
    .then(() => {
      console.log("檔案刪除成功！");
    })
    .catch((error) => {
      console.log("錯誤發生");
    });
}

// 存入資料庫
async function SaveToDB() {
  const payload = {
    id: park.id,
    data: park,
  };
  // console.log(payload);
  await store.saveFunpark(payload);
}

// 選擇上傳圖片，回傳檔案 file
async function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];
  let fileName = file.name;
  if (!file.type.match("image.*")) {
    return;
  }
  // 壓縮圖檔，Compress image to 200kb
  // console.log(file);
  const resAvatarFile = await compressAccurately(file, 200);
  // console.log(resAvatarFile);

  // 上傳圖片，儲存圖片
  saveImageMessage(fileName, resAvatarFile);
}

// A loading image URL. 等待旋轉小圖
const LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";

async function saveImageMessage(fileName, file) {
  // console.log(file);
  const message = park.便利商店[data.key];

  try {
    // 2 - Upload the image to Cloud Storage.
    const filePath = `/FunParks/${park.id}/${fileName}`;
    const newImageRef = StorageRef(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);

    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);
    // console.log(message, data.key, park.便利商店[data.key]);
    // 很多張照片，用array
    const image = {
      url: publicImageUrl,
      findKey: filePath,
    };
    message.照片.push(image);
  } catch (error) {
    console.error("storage 發生錯誤", error);
  }
}
</script>

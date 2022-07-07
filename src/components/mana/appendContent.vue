<template>
  <div class="q-mt-xl cursor-pointer">
    <q-expansion-item
      expand-separator
      class="text-h6 text-center cursor-pointer bg-teal-10 text-white"
      label="新增內容"
      @click="appendMessage"
    >
      <q-card class="bg-teal-1" flat>
        <q-card-section>
          <div class="q-ma-md row items-start" style="max-width: 100px">
            <q-input v-model="data.message.排序" label="排序">
              <template v-slot:append>
                <q-icon name="close" @click="data.message.排序 = ''" />
              </template>
            </q-input>
          </div>

          <div class="q-ma-md row items-start">
            <q-input
              v-model="data.message.標題"
              label="標題"
              class="full-width"
            >
              <template v-slot:append>
                <q-icon name="close" @click="data.message.標題 = ''" />
              </template>
            </q-input>
          </div>
          <div class="q-ma-md row items-start">
            <q-input
              v-model="data.message.內容"
              type="textarea"
              rows="2"
              label="內容"
              class="full-width"
            >
              <template v-slot:append>
                <q-icon name="close" @click="data.message.內容 = ''" />
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
          <div>
            <img
              :src="data.message.照片.url"
              alt=""
              style="border-radius: 3%/5%; max-width: 100px"
            />
          </div>

          <div class="q-ma-md row items-start" v-if="data.message.照片">
            <q-input
              v-model="data.message.照片.簡介"
              label="圖片簡介"
              class="full-width"
            >
              <template v-slot:append>
                <q-icon name="close" @click="data.message.照片.簡介 = ''" />
              </template>
            </q-input>
          </div>
          <q-btn
            label="新增"
            type="submit"
            color="deep-orange"
            icon="save"
            class="btn-fixed-width"
            @click="addSave()"
            v-if="showSaveBtnMsg"
          />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>
<script setup>
import { onMounted, computed, reactive, ref, toRefs, watchEffect } from "vue";
import { extend } from "quasar";

import { locationStore } from "stores/location";

import { compress, compressAccurately } from "image-conversion";
import {
  getStorage,
  ref as StorageRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const store = locationStore();
const props = defineProps({
  location: Object,
});
const park = props.location;

// const mediaCapture = ref(null);

onMounted(() => {
  // DOM元素在出事渲染后分配给ref
  // console.log(mediaCapture.value);
});

const blank = {
  標題: "",
  內容: "",
  照片: {
    findKey: "",
    url: "",
    簡介: "",
  },
  排序: "",
};
const showSaveBtnMsg = ref(false);
const data = reactive({
  message: {},
});
data.message = extend(true, {}, blank);

// 有輸資料才可以存檔
watchEffect(() => {
  let flag =
    data.message.標題 +
    data.message.內容 +
    data.message.照片.url +
    data.message.照片.簡介;
  // console.log(flag);
  showSaveBtnMsg.value = false;
  if (flag !== "") {
    showSaveBtnMsg.value = true;
  }
});

function appendMessage() {
  data.message = extend(true, {}, blank);
}

// 圖檔預覽、上傳
async function factoryFn2(files) {
  // 壓縮圖檔，Compress image to 200kb
  // const resAvatarFile = await compressAccurately(files, 100);
  // console.log(resAvatarFile);

  const payload = {
    id: park.id,
    files: files,
    // photo: data.message.照片
  };
  let storageInfo = await store.uploadPhoto(payload);
  data.message.照片.url = storageInfo.url;
  data.message.照片.findKey = storageInfo.findKey;
  // console.log("data.message", data.message);
}
// 存入資料庫
async function addSave() {
  console.log(park);
  // 新增段落的內容
  park.段落.push(data.message);
  park.段落.sort((a, b) => {
    // (小) 排在前面
    if (a.排序 > b.排序) return 1;
    else if (a.排序 < b.排序) return -1;
    else return 0;
  });
  console.log("段落", park.段落);
  showSaveBtnMsg.value = false;

  const payload = {
    id: park.id,
    data: park,
  };
  // console.log(payload);
  await store.saveFunpark(payload);
  data.message = extend(true, {}, blank);
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
  // }
}

// A loading image URL. 等待旋轉小圖
const LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";

async function saveImageMessage(fileName, file) {
  console.log(file);

  try {
    // 2 - Upload the image to Cloud Storage.
    const filePath = `/FunParks/${park.id}/${fileName}`;
    const newImageRef = StorageRef(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);

    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);
    data.message.照片.url = publicImageUrl;
    data.message.照片.findKey = filePath;
  } catch (error) {
    console.error("storage 發生錯誤", error);
  }
}
</script>

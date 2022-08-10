<template>
  <div>
    <!-- 這個隱藏的 input file select 放在迴圈裡面 ref會變成陣列 -->
    <input
      id="mediaCapture"
      ref="mediaCapture"
      type="file"
      accept="image/*"
      capture="camera"
      style="display: none"
      @change="onMediaFileSelected"
    />

    <div v-for="(item, key) in park.段落">
      <q-card
        class="q-mt-xl cursor-pointer bg-blue-grey-1"
        style="width: 100%; max-width: 800px"
      >
        <q-card-section class="row justify-end">
          <q-btn label="刪除" @click="delItem(key)"></q-btn>
        </q-card-section>
        <q-card-section class="">
          <div class="q-ma-md row items-start" style="max-width: 100px">
            <q-input v-model="item.排序" label="排序">
              <template v-slot:append>
                <q-icon name="close" @click="item.排序 = ''" />
              </template>
            </q-input>
          </div>
          <div class="q-ma-md row items-start">
            <q-input
              v-model="item.標題"
              label="標題"
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
              v-model="item.內容"
              type="textarea"
              rows="2"
              label="內容"
              class="full-width"
              style="font-size: 18px"
            >
              <template v-slot:append>
                <q-icon name="close" @click="item.內容 = ''" />
              </template>
            </q-input>
          </div>

          <div class="q-ma-md row items-start">
            <q-img
              contain
              :src="item.照片.url"
              v-if="item.照片.url"
              style="border-radius: 3%/5%; max-width: 300px"
              @click="$refs.mediaCapture.click((data.key = key))"
            >
            </q-img>
          </div>
          <div class="q-ma-md row items-start">
            <q-input
              v-model="item.照片.簡介"
              label="圖片介紹"
              class="full-width"
              style="font-size: 18px"
            >
              <template v-slot:append>
                <q-icon name="close" @click="item.照片.簡介 = ''" />
              </template>
            </q-input>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>
import { onMounted, computed, reactive, ref, toRefs, watchEffect } from "vue";
import { locationStore } from "stores/location";

import { compress, compressAccurately } from "image-conversion";
import {
  getStorage,
  ref as StorageRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const props = defineProps({
  location: Object,
});
const store = locationStore();

const data = reactive({
  message: {},
  key: "",
});

onMounted(() => {
  // DOM元素在出事渲染后分配给ref
  // console.log(mediaCapture.value);
});
const park = props.location;
// console.log(park);

// 圖檔預覽、上傳、並修改資料庫
async function factoryFn2(files) {
  const payload = {
    id: park.id,
    files: files,
  };
  let storageInfo = await store.uploadPhoto(payload);
  data.message.照片.url = storageInfo.url;
  data.message.照片.findKey = storageInfo.findKey;
  // console.log("段落", park.段落);
}

// 刪除item 資料
function delItem(index) {
  // console.log(park.段落[index]);
  // 刪除storage上的照片
  // console.log(park.段落[index].照片.findKey);
  if (park.段落[index].照片) {
    storageImgDelete(park.段落[index].照片.findKey);
  }
  park.段落.splice(index, 1); // 通过splice 删除数据

  // 更新記憶體，存到資料庫
  editSave();
}

function storageImgDelete(findKey) {
  if (!findKey) return;
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

// 存檔，存到資料庫即可
function editSave() {
  //更新前 段落 陣列需先排序
  park.lat = Number(park.lat);
  park.lng = Number(park.lng);
  park.rating = Number(park.rating);
  // /更新前 段落 陣列需先排序
  park.段落.sort((a, b) => {
    // (小) 排在前面
    if (a.排序 > b.排序) return 1;
    else if (a.排序 < b.排序) return -1;
    else return 0;
  });

  const payload = {
    id: park.id,
    data: park,
  };
  // console.log(payload);
  // 更新記憶體
  store.update_locations(payload);
  // 更新資料庫
  store.saveFunpark(payload);
}

// 選擇上傳圖片，回傳檔案 file
async function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];
  let fileName = file.name;
  // console.log(file);
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
  // console.log(data.key, park.段落[data.key]);
  // 內容: ""
  // 排序: "2"
  // 標題: ""
  // 照片:{
  //  findkey: ""
  //  url: ""
  //  }
  // 簡介: "照片簡介"

  try {
    // 2 - Upload the image to Cloud Storage.
    const filePath = `/FunParks/${park.id}/${fileName}`;
    const newImageRef = StorageRef(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);

    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);

    const message = park.段落[data.key];

    message.照片.url = publicImageUrl;
    message.照片.findKey = filePath;
  } catch (error) {
    console.error("storage 發生錯誤", error);
  }
}
</script>

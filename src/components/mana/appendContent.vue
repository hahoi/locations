<template>
  <div class="q-mt-xl cursor-pointer">
    <q-expansion-item
      expand-separator
      class="text-h6 text-center cursor-pointer bg-grey-5"
      label="新增內容"
      @click="appendMessage"
    >
      <q-card class="" flat>
        <q-card-section>
          <div class="q-ma-md row items-start" style="max-width: 100px">
            <q-input v-model="data.message.排序" label="排序" outlined>
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
              outlined
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
              outlined
            >
              <template v-slot:append>
                <q-icon name="close" @click="data.message.內容 = ''" />
              </template>
            </q-input>
          </div>

          <!-- 上傳訊息內容圖片 -->
          <div class="q-pa-md">
            <div class="text-center text-negative">記得要先按上傳圖片</div>
            <q-uploader
              :factory="factoryFn2"
              accept=".jpg, image/*"
              style="max-width: 300px"
            />
          </div>
          <!-- 非常重要 ， 不是用 data.message.image.intro 判斷，要用data.message.image判斷  -->

          <div class="q-ma-md row items-start" v-if="data.message.照片">
            <q-input
              v-model="data.message.照片.簡介"
              label="圖片簡介"
              class="full-width"
              outlined
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

const store = locationStore();
const props = defineProps({
  location: Object,
});
const park = props.location;

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
  console.log(payload);
  await store.saveFunpark(payload);
  data.message = extend(true, {}, blank);
}
</script>

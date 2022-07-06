<template>
  <div v-for="(item, key) in park.段落">
    <q-card
      class="q-mt-xl cursor-pointer"
      style="width: 100%; max-width: 800px"
      @click="editMessage(item, key)"
    >
      <!-- <div class="flex row "> -->
      <div v-html="item.排序"></div>
      <!-- <q-space /> -->
      <!-- <q-icon name="delete"  @click="deleteMsg(key)"/><q-icon name="close" /> -->
      <!-- </div> -->
      <q-card-section v-if="item.標題 != ''">
        <div class="text-h6" v-html="item.標題"></div>
      </q-card-section>

      <q-card-section class="q-pt-none text-subtitle1" v-if="item.內容">
        <div v-html="item.內容"></div>
      </q-card-section>
      <q-img
        contain
        :src="item.照片.url"
        v-if="item.照片.url"
        style="border-radius: 3%/5%; max-width: 300px"
      >
        <div class="absolute-bottom-left text-subtitle2" v-if="item.照片.簡介">
          {{ item.照片.簡介 }}
        </div>
      </q-img>
    </q-card>

    <!-- ＝＝＝編輯單一訊息內容＝＝＝ -->
    <q-dialog
      v-model="dialogMessage"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-grey-1" style="max-width: 800px; margin: 0 auto">
        <q-bar style="z-index: 1; position: fixed; top: 0; width: 100%">
          <q-btn push icon="close" class="bg-black text-white" v-close-popup
            >離開
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <!-- @click.stop.prevent="dialogMessage = false" -->

          <q-space />
        </q-bar>

        <q-card-section class="q-mt-xl">
          <q-form ref="form">
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
                style="font-size: 18px"
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
                style="font-size: 18px"
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
              <!-- 顯示已存在圖片 -->
              <img
                :src="data.message.照片.url"
                style="max-width: 300px"
                v-if="data.message.照片"
              />
            </div>
            <!-- {{data.message.照片}} -->
            <!-- 非常重要 ， 不是用 data.message.照片.intro 判斷，要用data.message.照片判斷  -->

            <div class="q-ma-md row items-start" v-if="data.message.照片">
              <q-input
                v-model="data.message.照片.簡介"
                label="圖片介紹"
                class="full-width"
                outlined
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="data.message.照片.簡介 = ''" />
                </template>
              </q-input>
            </div>
            <q-separator class="q-mt-xl" />
            <div class="flex row q-mt-md">
              <q-btn
                label="存檔"
                color="primary"
                icon="save"
                @click="editSave(key)"
              />
              <q-space />
              <q-btn
                label="刪除"
                color="negative"
                icon="save"
                @click="deleteMsg(key)"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { onMounted, computed, reactive, ref, toRefs, watchEffect } from "vue";
import { locationStore } from "stores/location";

const props = defineProps({
  location: Object,
});
const store = locationStore();

const dialogMessage = ref(false);
const data = reactive({
  message: {},
  key: "",
});

const park = props.location;
// console.log(park);

function editMessage(item, key) {
  // park.段落陣列中，每個 item
  // 先設定好要修改的段落
  data.message = park.段落[key];

  dialogMessage.value = true;
}
// 圖檔預覽、上傳、並修改資料庫
async function factoryFn2(files) {
  const payload = {
    id: park.id,
    files: files,
  };
  let storageInfo = await store.uploadPhoto(payload);
  data.message.照片.url = storageInfo.url;
  data.message.照片.findKey = storageInfo.findKey;
  console.log("段落", park.段落);
}

// 存檔，存到資料庫即可
function editSave(key) {
  //更新前 段落 陣列需先排序
  park.段落.sort((a, b) => {
    // (小) 排在前面
    if (a.排序 > b.排序) return 1;
    else if (a.排序 < b.排序) return -1;
    else return 0;
  });
  console.log("段落", park.段落);

  dialogMessage.value = false;
  const payload = {
    id: park.id,
    data: park,
  };
  store.saveFunpark(payload);
}
</script>

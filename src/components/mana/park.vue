<template>
  <div>
    <template v-if="store.locationDataReady">
      <q-card flat class="bg-grey-11">
        <q-card-section class="row justify-end">
          <q-btn label="刪除公園所有資料" @click="deletePark()"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-form ref="form">
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.名稱"
                label="名稱"
                class="full-width"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.名稱 = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.lat"
                label="lat 緯度"
                class="full-width"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.lat = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.lng"
                label="lng 經度"
                class="full-width"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.lng = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.navi"
                label="導航"
                class="full-width"
                type="textarea"
                rows="4"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.navi = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.縣市"
                label="縣市"
                class="full-width"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.縣市 = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.區域"
                label="區域"
                class="full-width"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.區域 = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.位置"
                label="位置"
                class="full-width"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.位置 = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.類別"
                label="類別"
                class="full-width"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.類別 = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.面積"
                label="面積"
                class="full-width"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.面積 = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.簡介"
                label="簡介"
                class="full-width"
                type="textarea"
                rows="2"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.簡介 = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.介紹"
                label="介紹"
                class="full-width"
                type="textarea"
                rows="6"
                style="font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.介紹 = ''" />
                </template>
              </q-input>
            </div>
            <div class="q-ma-md row items-start">
              <q-input
                v-model="park.rating"
                label="推薦"
                type="number"
                style="max-width: 100px; font-size: 18px"
              >
                <template v-slot:append>
                  <q-icon name="close" @click="park.rating = ''" />
                </template>
              </q-input>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions class="row justify-around">
          <q-btn
            class="bg-positive q-ma-xs"
            label="存 檔"
            style="width: 200px; font-size: 18px"
            @click="editSave()"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </template>
    <template v-else>
      <div class="row justify-center items-center">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </template>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, computed, reactive, ref, toRefs, watchEffect } from "vue";
import { locationStore } from "stores/location";
import { LocalStorage, Loading, extend, useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();
const props = defineProps({
  location: Object,
});
const store = locationStore();

const appendMsg = ref(false);
const data = reactive({});
const id = location.id || LocalStorage.getItem("parkId");
const restore = store.locationsFilteredArray.find((item) => id == item.id);

const park = props.location || restore;

// 存檔 pinia 記憶體部分不用存檔，存到firebase 即可
function editSave() {
  // lat,lng 轉換 string -> Number，因從 open data json 資料匯入是 Number
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
  // console.log(park);
  const payload = {
    id: park.id,
    data: park,
  };
  // 更新記憶體
  store.update_locations(payload);
  // 更新資料庫
  store.saveFunpark(payload);
}

function deletePark() {
  $q.dialog({
    title: "確定要刪除此公園全部資料？請輸入下面的公園名稱",
    message: park.id,
    prompt: {
      model: "",
      type: "text", // optional
    },
    cancel: true,
    persistent: true,
  })
    .onOk((data) => {
      if (data === park.id) {
        // console.log(park.id);
        store.deleteFuncPark(park.id);
        // 將資料庫刪除
        // 將 storage中檔案刪除
        router.back();
      } else {
      }
    })
    .onCancel(() => {})
    .onDismiss(() => {});
}
</script>

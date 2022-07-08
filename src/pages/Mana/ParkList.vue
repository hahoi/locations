<template>
  <q-page style="z-index: 1; max-width: 800px">
    <div class="q-ma-md" v-if="Authority">
      <!-- 關鍵字搜尋 -->
      <search class="q-ma-md full-width" />

      <template v-if="store.locationDataReady">
        <!-- List選項 -->
        <q-list bordered separator>
          <q-infinite-scroll @load="loadMore" :offset="500">
            <div v-for="(item, key) in showingData" :key="key">
              <q-item
                clickable
                v-ripple
                :to="{ name: 'edit', params: { parkId: item.id } }"
              >
                <q-item-section @click="storeLocationId(item.id)">
                  <q-item-label class="text-h6">{{ item.名稱 }}</q-item-label>
                  <q-item-label class="text-body1 text-grey">{{
                    item.縣市
                  }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <template>
                    <q-chip
                      color="deep-orange"
                      text-color="white"
                      icon-right="directions"
                    >
                    </q-chip>
                  </template>
                </q-item-section>
              </q-item>
              <q-separator />
            </div>
          </q-infinite-scroll>
        </q-list>
      </template>
      <template v-else>
        <div class="row justify-center">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>

      <!-- 回到頂端 -->
      <q-page-scroller
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 58]"
      >
        <q-btn fab icon="keyboard_arrow_up" color="grey-13" size="sm" />
      </q-page-scroller>
    </div>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed, toRefs, watchEffect } from "vue";
import { locationStore } from "stores/location";
import Search from "src/components/search";
import { LocalStorage, Loading, extend, useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();

const $q = useQuasar();
const store = locationStore();
// console.log("store locationsFiltered", store.locationsFiltered);

const rating = ref(0);
const area = ref(0);
const Authority = ref(false);

// 捲動分頁載入
const timer = null;
let start = 0;
let offset = 3;
let actualPosition = ref(3);
const showingData = computed(() => {
  return store.locationsFilteredArray.slice(0, actualPosition.value);
});
function loadMore(index, done) {
  if (
    // 一開始還沒讀入資料庫RepairCases.length = 0
    store.locationsFilteredArray.length != 0 &&
    actualPosition.value > store.locationsFilteredArray.length
  )
    return;
  const timer = setTimeout(() => {
    //分段取得累計值
    actualPosition.value += offset;
    done(timer);
  }, 100);
}
function done(timer) {
  clearTimeout(timer);
}

const selection = ref([]);
// let selectionText = computed(() => {
// 如果 template 中沒有把{{selectionText}}顯示出來，就不會作動。改watchEffect
//   let stext = selection.value.toString().replaceAll(",", " ");
//   store.set_search(stext);
//   return stext;
// });

//用誰就觀察誰，觀察值變化，執行函數
watchEffect(() => {
  //執行函數( 觀察值)
  let stext = selection.value.toString().replaceAll(",", " ");
  store.set_search(stext);
});
function storeLocationId(id) {
  // console.log(id);
  LocalStorage.set("parkId", id);
}
prompt();
function prompt() {
  $q.dialog({
    title: "請輸入編輯密碼",
    message: "",
    prompt: {
      model: "",
      isValid: (val) => val.length > 2, // << here is the magic
      cancel: false,
      type: "text", // optional
    },
    cancel: false,
    persistent: true,
  })
    .onOk((data) => {
      if (data === "20220708") {
        Authority.value = true;
      }
    })
    .onCancel(() => {})
    .onDismiss(() => {});
}
</script>
<style></style>

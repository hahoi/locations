<template>
  <q-page style="z-index: 1; max-width: 800px">
    <div class="q-ma-md" v-if="Authority8" ref="targetElm">
      <div class="">
        <!-- 新增按鈕 -->
        <q-btn
          fab
          color="info"
          size="xs"
          @click="dialogAdd = true"
          label="新增公園"
          class="q-ma-md text-h6 full-width"
        />
      </div>
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
                :class="`Elm${key}`"
                :to="{ name: 'edit', params: { parkId: item.id } }"
                ><q-item-section thumbnail v-if="item.段落[0]">
                  <div v-if="item.段落[0].照片.url">
                    <img :src="item.段落[0].照片.url" />
                  </div>
                </q-item-section>
                <q-item-section @click="storeLocationId(item.id, key)">
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

    <!-- 新增資料視窗============================== -->
    <q-dialog
      v-model="dialogAdd"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-grey-1 text-white">
        <q-bar>
          <q-btn flat icon="close" v-close-popup class="bg-black text-white"
            >離開
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <q-space />
        </q-bar>

        <q-card-section>
          <!-- 新增資料元件 -->
          <addPark />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
  onActivated,
  toRefs,
  watch,
  watchEffect,
  watchPostEffect,
} from "vue";
import { locationStore } from "stores/location";
import Search from "src/components/search";
import { LocalStorage, Loading, extend, useQuasar } from "quasar";
import { useRouter } from "vue-router";
import addPark from "src/pages/mana/addPark";
import { scroll } from "quasar";

const {
  getScrollTarget,
  getVerticalScrollPosition,
  setVerticalScrollPosition,
  getScrollHeight,
} = scroll;

const router = useRouter();

const $q = useQuasar();
const store = locationStore();
// console.log("store locationsFiltered", store.locationsFiltered);

const rating = ref(0);
const area = ref(0);
let targetElm = ref(null);
let target = null;

const Authority8 = ref(false);
const dialogAdd = ref(false);

if (!store.locationDataReady) {
  store.queryFunParks();
}

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
function storeLocationId(id, key) {
  LocalStorage.set("parkId", id);
  target = targetElm.value.querySelector(`.Elm${key}`);
  target.style.background = "#dedede";
  // console.log(target);
}
function scrollToElement(el) {
  // console.log(el);
  let target = getScrollTarget(el);
  // console.log(target);
  let offset = el.offsetTop; //- el.scrollHeight;
  let duration = 500;
  setVerticalScrollPosition(target, offset, duration);
}

onMounted(async () => {
  Authority8.value = (await LocalStorage.getItem("Authority8")) || false;

  if (!Authority8.value) {
    prompt();
  }
});

onActivated(() => {
  if (target) {
    // console.log(target);
    scrollToElement(target);
  }
});

function prompt() {
  $q.dialog({
    title: "請輸入編輯密碼",
    message: "",
    prompt: {
      model: "",
      // isValid: (val) => val.length > 2, // << here is the magic
      cancel: false,
      type: "text", // optional
    },
    cancel: false,
    persistent: true,
  })
    .onOk((data) => {
      if (data === "20220805") {
        Authority8.value = true;
        LocalStorage.set("Authority8", Authority8.value);
      } else {
        LocalStorage.set("Authority8", false);
      }
    })
    .onCancel(() => {})
    .onDismiss(() => {});
}
</script>
<style></style>

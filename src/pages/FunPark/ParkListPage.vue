<template>
  <q-page style="z-index: 1; max-width: 800px">
    <div class="q-ma-md">
      <q-expansion-item
        expand-separator
        icon="nature_people"
        label="好玩的公園在哪裡？"
        caption="點我幫幫你"
        class="text-h6 bg-brown-3"
      >
        <q-card class="bg-brown-1 text-black text-body1">
          <q-card-section>
            <div class="q-gutter-sm" style="position: relative">
              <q-radio
                v-model="sel_radio"
                val="屏東縣"
                label="屏東縣"
                color="teal"
              />
              <q-radio
                v-model="sel_radio"
                val="新北市"
                label="新北市"
                color="teal"
              />
              <q-radio
                v-model="sel_radio"
                val="台北市"
                label="台北市"
                color="teal"
              />
            </div>
          </q-card-section>

          <q-separator />
          <q-card-section>
            <div class="q-gutter-sm">
              <q-checkbox
                v-model="selection"
                val="溜滑梯"
                label="溜滑梯"
                color="orange"
              />
              <q-checkbox
                v-model="selection"
                val="鞦韆"
                label="鞦韆"
                color="orange"
              />
              <q-checkbox
                v-model="selection"
                val="翹翹板"
                label="翹翹板"
                color="orange"
              />
              <q-checkbox
                v-model="selection"
                val="沙坑"
                label="沙坑"
                color="orange"
              />
              <q-checkbox
                v-model="selection"
                val="彈跳床"
                label="彈跳床"
                color="orange"
              />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="q-gutter-sm">
              <q-checkbox
                v-model="selection"
                val="草原"
                label="草原"
                color="Cyan"
              />
              <q-checkbox
                v-model="selection"
                val="樹屋"
                label="樹屋"
                color="Cyan"
              />
              <q-checkbox
                v-model="selection"
                val="哺乳室"
                label="哺乳室"
                color="Cyan"
              />
              <q-checkbox
                v-model="selection"
                val="飲水機"
                label="飲水機"
                color="Cyan"
              />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row q-gutter-md justify-start items-center">
              <!-- <div>
                <input
                  v-model.number="area"
                  type="number"
                  style="max-width: 50px; max-height: 30px; height: 30px"
                /><span>公頃以上 </span>
              </div> -->
              <div>
                <span>推薦</span>
                <q-rating v-model="rating" size="1.6em" color="primary" />
              </div>
            </div>
          </q-card-section>
          <div
            style="
              position: absolute;
              top: 182px;
              right: 10px;
              border: 1px solid #f90101;
              border-radius: 5px;
              box-shadow: 2px 1px 8px 3px rgba(0, 0, 0, 0.1);
              color: #fff;
              background-color: #f90101;
            "
            @click="clearSelect()"
          >
            清除
          </div>

          <q-separator />
        </q-card>
      </q-expansion-item>

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
                :to="{ name: 'showPark', params: { parkId: item.id } }"
                ><q-item-section thumbnail v-if="item.段落[0]">
                  <div v-if="item.段落[0].照片.url">
                    <img :src="item.段落[0].照片.url" />
                  </div>
                </q-item-section>
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
import {
  ref,
  reactive,
  computed,
  toRefs,
  watch,
  watchEffect,
  watchPostEffect,
} from "vue";
import { locationStore } from "stores/location";
import Search from "src/components/search";
import { LocalStorage, Loading, extend } from "quasar";

const store = locationStore();
// console.log("store locationsFiltered", store.locationsFiltered);
// store.set_dataReady(false);
// console.log(store.locationDataReady);
if (!store.locationDataReady) {
  store.queryFunParks();
}

// const locations = computed(() => store.locationsFilteredArray); // 響應式
let rating = ref(0);
let area = ref(0);

// 捲動分頁載入
const timer = null;
let start = 0;
let offset = 3;
let actualPosition = ref(3);
const showingData = computed(() => {
  return store.locationsFilteredArray.slice(start, actualPosition.value);
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
const sel_radio = ref("");
// let selectionText = computed(() => {
// 如果 template 中沒有把{{selectionText}}顯示出來，就不會作動。改watchEffect
//   let stext = selection.value.toString().replaceAll(",", " ");
//   store.set_search(stext);
//   return stext;
// });

//用誰就觀察誰，觀察值變化，執行函數
watchPostEffect(() => {
  //執行函數( 觀察值)
  let stext =
    sel_radio.value + " " + selection.value.toString().replaceAll(",", " ");
  store.set_search(stext);
});

// 將id 存入storeLocation中，重整時讀出
function storeLocationId(id) {
  // console.log(id);
  LocalStorage.set("parkId", id);
}
function clearSelect() {
  store.set_search("");
  sel_radio.value = "";
  selection.value = [];
  store.set_search("");
}
</script>
<style></style>

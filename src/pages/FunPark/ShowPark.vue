<template>
  <q-page class="q-pa-md row items-start q-gutter-sm" style="max-width: 800px">
    <template v-if="store.locationDataReady">
      <q-card class="my-card" flat bordered>
        <q-card-section class="">
          <!-- <div class="text-overline">Overline</div> -->
          <div class="row justify-center items-center">
            <div
              class="text-h5 text-center q-ma-md"
              v-html="matchLocation.名稱"
            ></div>
            <div style="width: 30px" @click="showMap()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 232597 333333"
                shape-rendering="geometricPrecision"
                text-rendering="geometricPrecision"
                image-rendering="optimizeQuality"
                fill-rule="evenodd"
                clip-rule="evenodd"
              >
                <path
                  d="M151444 5419C140355 1916 128560 0 116311 0 80573 0 48591 16155 27269 41534l54942 46222 69232-82338z"
                  fill="#1a73e8"
                ></path>
                <path
                  d="M27244 41534C10257 61747 0 87832 0 116286c0 21876 4360 39594 11517 55472l70669-84002-54942-46222z"
                  fill="#ea4335"
                ></path>
                <path
                  d="M116311 71828c24573 0 44483 19910 44483 44483 0 10938-3957 20969-10509 28706 0 0 35133-41786 69232-82313-14089-27093-38510-47936-68048-57286L82186 87756c8166-9753 20415-15928 34125-15928z"
                  fill="#4285f4"
                ></path>
                <path
                  d="M116311 160769c-24573 0-44483-19910-44483-44483 0-10863 3906-20818 10358-28555l-70669 84027c12072 26791 32159 48289 52851 75381l85891-102122c-8141 9628-20339 15752-33948 15752z"
                  fill="#fbbc04"
                ></path>
                <path
                  d="M148571 275014c38787-60663 84026-88210 84026-158728 0-19331-4738-37552-13080-53581L64393 247140c6578 8620 13206 17793 19683 27900 23590 36444 17037 58294 32260 58294 15172 0 8644-21876 32235-58320z"
                  fill="#34a853"
                ></path>
              </svg>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-md intro">
          <div>縣市：<span v-html="matchLocation.縣市"></span></div>
          <div>區域：<span v-html="matchLocation.區域"></span></div>
          <div>位置：<span v-html="matchLocation.位置"></span></div>
          <div>
            面積：<span v-html="matchLocation.面積"></span
            ><span v-if="matchLocation.面積"></span>
          </div>
          <div>類別：<span v-html="matchLocation.類別"></span></div>
        </q-card-section>
        <q-card-section class="intro">
          <div><span v-html="matchLocation.簡介"></span></div>
        </q-card-section>
        <q-card-section class="intro">
          <div v-if="matchLocation.設施">遊具設施</div>
          <div v-html="br(matchLocation.設施)"></div>
        </q-card-section>

        <q-separator />
      </q-card>

      <template
        v-if="matchLocation.段落"
        v-for="(item, key) in matchLocation.段落"
        class="q-pa-md row items-start q-gutter-md"
      >
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <div class="text-h6" v-html="item.標題"></div>
          </q-card-section>

          <q-card-section class="row q-pt-none">
            <div class="text-subtitle1 col-sm-6 col-xs-12">
              <div class="q-mr-md" v-html="item.內容"></div>
            </div>
            <div class="col-sm-6 col-xs-12">
              <q-img
                contain
                spinner-color="white"
                :src="item.照片.url"
                @click="previewImgObject(item.照片.url)"
                style="border-radius: 3%/5%"
              >
                <!-- max-width: 300px -->
                <div
                  class="absolute-bottom-left text-subtitle2"
                  v-if="item.照片.簡介 != ''"
                >
                  {{ item.照片.簡介 }}
                </div>
              </q-img>
            </div>
          </q-card-section>
        </q-card>
      </template>
      <q-card class="my-card" flat bordered>
        <q-card-section class="intro">
          <div><span v-html="matchLocation.介紹"></span></div>
        </q-card-section>
      </q-card>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <div class="q-mt-md">
          <q-fab
            v-model="fab1"
            label="周邊設施"
            label-position="top"
            color="purple"
            icon="keyboard_arrow_up"
            direction="up"
            :hide-label="hideLabels"
          >
            <q-fab-action
              color="primary"
              icon="account_balance"
              label="廁所"
              :hide-label="hideLabels"
              :to="{ name: 'Bathroom', params: { parkId: id } }"
            />
            <q-fab-action
              color="secondary"
              icon="local_parking"
              label="停車場"
              :hide-label="hideLabels"
              :to="{ name: 'parkingLot', params: { parkId: id } }"
            />
            <q-fab-action
              color="orange"
              icon="soup_kitchen"
              label="附近美食"
              :hide-label="hideLabels"
              :to="{ name: 'DiningSnacks', params: { parkId: id } }"
            />
            <q-fab-action
              color="brown"
              icon="local_atm"
              label="便利商店"
              :hide-label="hideLabels"
              :to="{ name: 'ConvenienceStore', params: { parkId: id } }"
            />
            <q-fab-action
              color="info"
              icon="tour"
              label="附近景點"
              :hide-label="hideLabels"
              :to="{ name: 'Tourist', params: { parkId: id } }"
            />
          </q-fab>
        </div>
      </q-page-sticky>
    </template>

    <template v-else>
      <div class="row justify-center items-center">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </template>
  </q-page>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, toRefs, computed } from "vue";
import { locationStore } from "stores/location";
import { LocalStorage, Loading, extend } from "quasar";

// npm install v-viewer@next
import "viewerjs/dist/viewer.css";
import { api as viewerApi } from "v-viewer";

const router = useRouter();
const route = useRoute();

const id = route.params.parkId || LocalStorage.getItem("parkId");
// console.log("showPark id", id);
const store = locationStore();
const location = store.locationsFilteredArray.find((item) => id == item.id);
// console.log("location data", location);

if (!store.locationDataReady) {
  router.push("/");
}

// 設定fab縮起來
const fab1 = ref(false);
const hideLabels = ref(false);

function br(text) {
  // return text.replaceAll(",", "<br />");
  return text;
}

//將找到符合的關鍵字用紅色字顯示
const matchLocation = computed(() => {
  //複製一份
  let task = Object.assign({}, location);
  if (store.search) {
    let arraySearchWord = store.search.split(/\s+/);

    //每一筆資料比對多個關鍵字 and
    arraySearchWord.forEach((keyword, index) => {
      //搜尋每個欄位
      Object.keys(task).forEach((key) => {
        //搜尋文字型態個欄位

        if (typeof task[key] === "string") {
          let item = task[key]; //欄位內容
          let searchLowerCase = keyword.toLowerCase(); //搜尋關鍵字要轉成小寫英文姓名才不會出錯
          let itemLowerCase = item.toLowerCase(); //欄位內容要轉成小寫英文姓名才不會出錯
          //欄位內容是否含有關鍵字
          if (itemLowerCase.includes(searchLowerCase)) {
            keyword = keyword.replaceAll("?", ""); //去除??，匯入時字元錯誤產生
            let regex = new RegExp(keyword, "i");
            let match = item.match(regex);
            //欄位內容是否含有關鍵字
            if (match[0] !== "") {
              item = item.replace(
                regex,
                "<span class='bg-red text-white inline'>" + match[0] + "</span>"
              );

              task[key] = item;
            }
          }
        }

        // 針對每個段落搜尋
        if (key === "段落") {
          task[key].forEach((elm) => {
            //搜尋elm中每個欄位
            Object.keys(elm).forEach((key) => {
              if (typeof elm[key] === "string") {
                // 段落中符合的文字，記錄下來
                // console.log(key, task[key],searchLowerCase)
                let item = elm[key];
                let searchLowerCase = keyword.toLowerCase();
                //欄位內容是否含有關鍵字
                if (item.includes(searchLowerCase)) {
                  let regex = new RegExp(keyword, "i");
                  let match = item.match(regex);
                  //欄位內容是否含有關鍵字
                  if (match[0] !== "") {
                    item = item.replace(
                      regex,
                      "<span class='bg-red text-white inline'>" +
                        match[0] +
                        "</span>"
                    );

                    elm[key] = item;
                  }
                }
              }
            });
          }); //end 段落
        } //end if 段落
      }); //end Object.keys
      // console.log(task);
    });
  }
  return task;
});
function showMap() {
  // console.log(location.id);
  store.set_search(location.id);
  router.push("/FunPark/map");
}

function previewImgObject(url) {
  // console.log([url]);
  const $viewer = viewerApi({
    options: {
      title: false,
    },
    images: [url], //必須是陣列map
  });
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 800px
.intro
  font-size: 18px
  color: #333333
  line-height: 30px
  letter-spacing: 2.6px
  word-spacing: 2px
  text-align: justify
  text-decoration: none
  text-transform: none
  text-size-adjust: 100%
</style>

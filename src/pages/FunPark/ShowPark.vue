<template>
  <q-page class="q-pa-md row items-start q-gutter-sm" style="max-width: 800px">
    <q-card class="my-card" flat bordered>
      <q-card-section class="" row items-start>
        <!-- <div class="text-overline">Overline</div> -->
        <div
          class="text-h5 text-center q-mt-sm q-mb-xs"
          v-html="matchLocation.名稱"
        ></div>
      </q-card-section>
      <q-card-section class="q-gutter-md intro">
        <div>縣市：<span v-html="matchLocation.縣市"></span></div>
        <div>區域：<span v-html="matchLocation.區域"></span></div>
        <div>位置：<span v-html="matchLocation.位置"></span></div>
        <div>
          面積：<span v-html="matchLocation.面積"></span
          ><span v-if="matchLocation.面積">公頃</span>
        </div>
        <div>類別：<span v-html="matchLocation.類別"></span></div>
      </q-card-section>
      <q-card-section class="intro">
        <div><span v-html="matchLocation.簡介"></span></div>
      </q-card-section>
      <q-card-section class="intro">
        <div><span v-html="matchLocation.介紹"></span></div>
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
          <div
            class="text-subtitle1 col-sm-6 col-xs-12"
            v-html="item.內容"
          ></div>
          <div class="col-sm-6 col-xs-12">
            <q-img
              contain
              spinner-color="white"
              :src="item.照片.url"
              @click="previewImgObject(item.照片.url)"
              style="border-radius: 3%/5%; max-width: 300px"
            >
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
        </q-fab>
      </div>
    </q-page-sticky>
  </q-page>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, toRefs, computed } from "vue";
import { locationStore } from "stores/location";

// npm install v-viewer@next
import "viewerjs/dist/viewer.css";
import { api as viewerApi } from "v-viewer";

const router = useRouter();
const route = useRoute();

const id = route.params.parkId;
const store = locationStore();
const location = store.locationsFilteredArray.find((item) => id == item.id);
// console.log(id);
// const data = reactive({
//   location: store.locationsFiltered[id],
// });

// 設定fab縮起來
const fab1 = ref(false);
const hideLabels = ref(false);

function br(text) {
  return text.replaceAll(",", "<br />");
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

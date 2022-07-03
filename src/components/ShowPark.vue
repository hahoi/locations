<template>
  <q-page class="q-pa-md row items-start q-gutter-md" style="max-width: 800px">
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <!-- <div class="text-overline">Overline</div> -->
          <div
            class="text-h6 q-mt-sm q-mb-xs"
            v-html="matchLocation.名稱"
          ></div>
          <div class="intro" v-html="matchLocation.簡介"></div>
        </q-card-section>

        <q-card-section class="flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-section horizontal>
        <!-- <q-img class="col" src="https://cdn.quasar.dev/img/parallax2.jpg" />
        <q-separator vertical /> -->

        <q-card-section class="" v-html="br(matchLocation.設施)">
        </q-card-section>
      </q-card-section>
    </q-card>
    <div class="q-mt-md">
      <q-fab
        v-model="fab1"
        label=""
        label-position="left"
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action
          color="primary"
          @click="onClick"
          icon="mail"
          label="廁所"
        />
        <q-fab-action
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="停車場"
        />
      </q-fab>
    </div>
  </q-page>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, toRefs, computed } from "vue";
import { locationStore } from "stores/location";

const router = useRouter();
const route = useRoute();

const store = locationStore();
//---------- data ----------
const id = route.params.parkId;

const keywordSearch = computed(() => store.search); // 響應式
// console.log(store.locations);

// console.log(id);
const location = store.locationsFilteredArray.find((item) => id == item.id);
// const data = reactive({
//   location: store.locationsFiltered[id],
// });

// 設定縮起來
let fab1 = ref(false);

function onClick() {
  // console.log('Clicked on a fab action')
}

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
      });
      // console.log(task);
    });
  }
  return task;
});
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 800px
.intro
  color: #333333
  line-height: 1.7
  letter-spacing: 0px
  word-spacing: 2px
  text-align: justify
  text-decoration: none
  text-transform: none
</style>

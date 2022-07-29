<template>
  <div>
    <!-- {{ data.TaipeiMap }} -->
    <q-list bordered separator>
      <div v-for="(item, key) in data.Taipei" :key="key">
        <q-item clickable v-ripple
          ><q-item-section>
            <q-item-label class="text-h6" @click="getUrlData(item)">{{
              item.名稱
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
</template>
<script setup>
import { ref, reactive, computed, toRefs } from "vue";
import { api, request } from "src/boot/axios.js";
import 台北市公園 from "../assets/Taipei";
import 台北市共融公園url from "../assets/台北市共融公園url";
const cheerio = require("cheerio");

const data = reactive({
  Taipei: null,
});

const TaipeiMap = 台北市公園.map((item) => {
  const data = {
    名稱: item.Col1,
    簡介: item.Col2,
    lng: item.Col3,
    lat: item.Col4,
    設施: "",
    縣市: "台北市" + item.Col11,
    位置: item.Col7,
  };
  return data;
});

const park = [];
const nomatch = [];
TaipeiMap.forEach((item) => {
  台北市共融公園url.forEach((elm) => {
    if (elm.主題 === item.名稱) {
      const data = {
        ...item,
        url: elm.URL,
        便利商店: [],
        段落: [],
        停車場: [],
        廁所: [],
        附近美食: [],
      };

      park.push(data);
    }
  });
});
data.Taipei = park;
console.log(park);

// console.log(data.Taipei);
async function getUrlData(park) {
  const apiUrl = process.env.API + park.url;
  // console.log()
  const result = await api.get(apiUrl);
  // console.log(resault.data);

  const $ = cheerio.load(result.data);

  const 一個段落 = {
    內容: "",
    排序: "",
    標題: "",
    照片: {
      findKey: "",
      url: "",
      簡介: "",
    },
  };

  let imgurl = $(".p img").attr("src");
  // console.log("首張照片", $(".p img").attr("src"));
  let 介紹 = "";
  if ($(".p figcaption span").text()) {
    介紹 = $(".p figcaption span").text();
  } else if ($(".p figcaption p:first").text()) {
    介紹 = $(".p figcaption p:first").text();
  } else if ($(".p figure div:first").text()) {
    介紹 = $(".p figure div:first").text();
  } else if ($(".p figure span:first").text()) {
    介紹 = $(".p figure span:first").text();
  } else if ($(".p div").text()) {
    let strtemp = $(".p div").text();
    let indexOfFirst = strtemp.indexOf("。");
    介紹 = strtemp.substring(0, indexOfFirst + 1);
  }
  console.log(介紹);
  一個段落.內容 = 介紹;
  一個段落.標題 = park.名稱;
  一個段落.照片.url = imgurl;
  park.段落.push(一個段落);

  const tableEL = $("table"); //共有4個table

  tableEL.each((t, item) => {
    // console.log(item); //item物件型態 ，$(item) cheerio function 型態
    // $("tr th , tr td , img", item).each((i, elem) => {

    $("tr", item).each((r, trelem) => {
      const 一個段落 = {
        內容: "",
        排序: "",
        標題: "",
        照片: {
          findKey: "",
          url: "",
          簡介: "",
        },
      };
      $("td", trelem).each((d, tdelem) => {
        console.log("table" + t, r, d, $(tdelem).text());
        console.log($("img", tdelem).attr("src"));
        if (t === 0) {
          if (d === 0) {
            一個段落.標題 = $(tdelem).text();
          }
          if (d === 1) {
            一個段落.照片.url = $("img", tdelem).attr("src");
          }
          if (d === 2) {
            一個段落.內容 = $(tdelem).text();
          }
        }
        if (t === 1) {
          console.log(t, r, d, $("img", tdelem).attr("src"));
          if (r === 1) {
            一個段落.照片.url = $("img", tdelem).attr("src");
          }
          if (r === 5) {
            park.設施 = $(tdelem).text();
          }
        }
      });
      if (t === 0 && r !== 0) {
        //th 標題不要
        // console.log(t, r, 一個段落);

        park.段落.push(一個段落);
      }
    });
  });

  console.log(park);
}
</script>

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
          <q-item-section side>
            <q-btn label="存檔" @click="savePark(item)"></q-btn>
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
import 台北市公廁 from "../assets/台北市公廁";

import { locationStore } from "stores/location";

const cheerio = require("cheerio");

const store = locationStore();

const data = reactive({
  Taipei: null,
});

const TaipeiMap = 台北市公園.map((item) => {
  const data = {
    名稱: item.Col1,
    簡介: item.Col2 || "",
    lng: item.Col3,
    lat: item.Col4,
    設施: "",
    縣市: "台北市",
    區域: item.Col11,
    位置: item.Col7,
  };

  data.廁所 = [];
  台北市公廁.forEach((elm) => {
    let dis = GetDistance(data.lat, data.lng, elm.緯度, elm.經度);

    if (dis <= 0.2) {
      // console.log(data, elm.緯度, elm.經度);
      // console.log(elm.公廁名稱, dis, elm.緯度, ",", elm.經度);
      data.廁所.push({
        標題: elm.公廁名稱,
        距離: dis * 1000,
        lat: elm.緯度,
        lng: elm.經度,
        內容: "",
        照片: [],
        navi: "",
      });
      // console.log(item);
    }
  });

  return data;
});

// 方法定义 lat,lng
function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = (lat1 * Math.PI) / 180.0;
  var radLat2 = (lat2 * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137; // EARTH_RADIUS; //公尺   //  6378.137 公里
  // s = Math.round(s * 10000) / 10000;
  s = Math.round(s * 10000) / 10000;
  // s = s.toFixed(4);
  return s;
}
// 调用 return的距离单位为km
// console.log(TaipeiMap);

const parks = [];
let park = {};
台北市共融公園url.forEach((elm) => {
  const pitem = TaipeiMap.find((item) => elm.主題 === item.名稱);

  if (pitem) {
    park = {
      ...pitem,
      url: elm.URL,
      排序: "B",

      便利商店: [],
      段落: [],
      停車場: [],
      // 廁所: [],
      附近美食: [],
    };
  } else {
    park = {
      名稱: elm.主題,
      排序: "B",
      lat: elm.lat,
      lng: elm.lng,
      url: elm.URL,
      縣市: "台北市",
      簡介: "",
      便利商店: [],
      段落: [],
      停車場: [],
      廁所: [],
      附近美食: [],
    };
  }
  if (!park.lat) {
    console.log(elm.主題);
  }
  parks.push(park);
});
data.Taipei = parks;
console.log(parks);

// console.log(data.Taipei);
async function getUrlData(park) {
  const apiUrl = process.env.API + park.url;
  console.log(apiUrl);
  const result = await api.get(apiUrl);

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
    let lastIndexOf = strtemp.lastIndexOf("。");
    介紹 = strtemp.substring(0, lastIndexOf + 1);
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
    let sr = false;
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
        // console.log($("img", tdelem).attr("src"));
        if (t === 0) {
          // if (d === 0) {
          //   一個段落.標題 = $(tdelem).text();
          // }
          if (d === 1) {
            一個段落.照片.url = $("img", tdelem).attr("src") || "";
          }
          if (d === 2) {
            一個段落.內容 = $(tdelem).text();
          }
        }
        if (t === 1) {
          if (r === 0 && $(tdelem).text() === "遊樂場資訊") {
            sr = true;
          }
          console.log(t, r, d, $("img", tdelem).attr("src"));
          if (sr) {
            if (r === 1) {
              park.區域 = $(tdelem).text();
            }
            if (r === 2) {
              一個段落.照片.url = $("img", tdelem).attr("src") || "";
              park.位置 = $(tdelem).text();
            }

            if (r === 6) {
              park.設施 = $(tdelem).text();
            }
          } else {
            if (r === 0) {
              park.區域 = $(tdelem).text();
            }
            if (r === 1) {
              一個段落.內容 = "平面圖";
              一個段落.照片.url = $("img", tdelem).attr("src") || "";
              park.位置 = $(tdelem).text();
            }

            if (r === 5) {
              park.設施 = $(tdelem).text();
            }
          }
        }
        let zstr = "";
        if (t === 2) {
          if (r === 0) {
            if (d === 0) {
              if ($(tdelem).text() === "有") {
                zstr += "、遮陽設施";
              }
            }
            if (d === 1) {
              if ($(tdelem).text() === "有") {
                zstr += "、休息區";
              }
            }
          }

          if (r === 1) {
            if (d === 0) {
              if ($(tdelem).text() === "有") {
                zstr += "、沖洗區";
              }
            }
            if (d === 1) {
              if ($(tdelem).text() === "有") {
                zstr += "、輪椅推車停放區";
              }
            }
          }

          if (r === 2) {
            if (d === 0) {
              if ($(tdelem).text() === "有") {
                zstr += "、無障礙廁所";
              }
            }
            if (d === 1) {
              if ($(tdelem).text() === "有") {
                zstr += "、哺乳室";
              }
            }
          }

          if (r === 4) {
            if (d === 1) {
              if ($(tdelem).text() === "有") {
                zstr += "、育嬰室";
              }
            }
          }
          // console.log("------------", park.設施);
          park.設施 += zstr;
        }
      });
      if (一個段落.內容 || 一個段落.照片.url) {
        //th 標題不要

        park.段落.push(一個段落);
      }
    });
  });

  // console.log(park);
}

async function savePark(park) {
  // getUrlData(park);
  park.id = "台北市" + park.名稱;
  park.類別 = "共融式遊戲場";
  const payload = {
    id: park.id,
    data: park,
  };
  console.log("============");
  console.log(park.名稱);
  console.log(park.lng);
  console.log(park.lat);
  console.log("縣市", park.縣市);
  console.log("區域", park.區域);
  console.log("位置", park.位置);
  console.log(park.類別);
  console.log("簡介", park.簡介);
  console.log("設施", park.設施);
  console.table(park.段落);
  console.log(park);

  // if (park.縣市) {
  //   await store.updateFunpark(payload);
  // } else {
  await store.saveFunpark(payload);
  // }
}
</script>

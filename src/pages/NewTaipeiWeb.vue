<template>
  <div>
    <!-- {{ data.TaipeiMap }} -->
    <q-list bordered separator>
      <div v-for="(item, key) in data.NewTaipei" :key="key">
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
import 新北市公園 from "../assets/新北市公園.json";

import { locationStore } from "stores/location";

const cheerio = require("cheerio");

const store = locationStore();

const data = reactive({
  NewTaipei: null,
});

const NewTaipei = 新北市公園.map((item) => {
  let latlng = item.latlng.split(",");

  return {
    名稱: item.名稱,
    // 簡介: item.Col2 || "",
    lat: Number(latlng[0]),
    lng: Number(latlng[1]),
    設施: item.遊具設施 + item.體健設施,
    縣市: "新北市",
    排序: "C",
    區域: item.行政區 + item.里別,
    位置: item.位置,
    面積: item.面積 + "（m2）",
    url: item.超連結,
    便利商店: [],
    段落: [],
    停車場: [],
    廁所: [],
    附近美食: [],
  };
});
data.NewTaipei = NewTaipei;

async function getUrlData(park) {
  const apiUrl = process.env.API + park.url;
  console.log(apiUrl);
  const result = await api.get(apiUrl);
  // console.log(result.data);

  const $ = cheerio.load(result.data);
  $("img", ".views-photo").each((t, item) => {
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
    一個段落.照片.url =
      "https://www.cpqweb.com/ntparks/" + $(item).attr("src") || "";
    park.段落.push(一個段落);
    console.log(t, $(item).attr("src"));
    //
  });
  $("table").each((t, t_item) => {
    $("tr", t_item).each((r, r_item) => {
      $("td", r_item).each((d, d_item) => {
        console.log("table" + t, r, d, $(d_item).text());
        if (t === 5 && r === 1 && d === 1) {
          park.簡介 = $(d_item).text();
        }
      });
    });

    //
  });
  console.log(park);
}

async function savePark(park) {
  // getUrlData(park);
  park.id = "新北市" + park.名稱;
  park.類別 = "共融公園";
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

  await store.saveFunpark(payload);
}
</script>

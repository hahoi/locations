<template>
  <div>
    <!-- {{ data.Kaohsiung }} -->
    <q-list bordered separator>
      <div v-for="(item, key) in data.Kaohsiung" :key="key">
        <q-item clickable v-ripple
          ><q-item-section>
            <q-item-label class="text-h6" @click="getUrlData(item)">{{
              item.url
            }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn label="存檔" @click="savePark(item)"></q-btn>
            <!-- <q-btn label="更新" @click="updatePark(item)"></q-btn> -->
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
</template>
<script setup>
import { ref, reactive, computed, toRefs } from "vue";
import { api, request } from "src/boot/axios.js";
import 高雄市公園 from "../assets/高雄市url";

import { locationStore } from "stores/location";

const cheerio = require("cheerio");

const store = locationStore();

const data = reactive({
  Kaohsiung: null,
});

const Kaohsiung = 高雄市公園.map((item) => {
  let latlng = item.latlng.split(",");

  return {
    名稱: "",
    // 簡介: item.Col2 || "",
    lat: Number(latlng[0]),
    lng: Number(latlng[1]),
    縣市: "高雄市",
    排序: "D",
    區域: "",
    位置: "",
    面積: "",
    url: item.url,
    便利商店: [],
    段落: [],
    停車場: [],
    廁所: [],
    附近美食: [],
  };
});
data.Kaohsiung = Kaohsiung;

async function getUrlData(park) {
  const apiUrl = process.env.API + park.url;
  console.log(apiUrl);
  const result = await api.get(apiUrl);
  // console.log(result.data);

  const $ = cheerio.load(result.data);
  const playGround = $(".playGround_wrap");
  // console.log(playGround.html());

  park.名稱 = $(".h4", playGround).text();
  let 適用對象 = $(".badge.badge-primary.p-2", playGround).text();
  let 簡介 = $(".text-dark.my-3.my-md-4", playGround).text();
  park.位置 = $("ul li.mb-1:nth-child(1) span:nth-child(2)", playGround).text();
  park.設施 = 適用對象;
  park.簡介 = 簡介;
  park.介紹 =
    $("ul li:nth-child(2) span", playGround).text() +
    "<br />" +
    $("ul li:nth-child(3) span", playGround).text() +
    "<br />" +
    $("ul li:nth-child(4) span", playGround).text();

  const playGround_tit = $(
    ".col-12.col-md-6.col-lg-4.kf-img.obj-img-cover.mb-3"
  );
  // console.log(playGround_tit);
  playGround_tit.each((key, item) => {
    console.log($("img", item).attr("src"));
    console.log($(".h5", item).text());
    console.log($(".mt-2", item).text());

    const 一個段落 = {
      內容: $(".mt-2", item).text() || "",
      排序: "",
      標題: $(".h5", item).text() || "",
      照片: {
        findKey: "",
        url: "https://pwbmo.kcg.gov.tw/" + $("img", item).attr("src") || "",
        簡介: "",
      },
    };
    console.log(一個段落);
    park.段落.push(一個段落);
  });
  let 設施 = "";
  const table = $("table", playGround);
  // console.log($("tr:nth-child(1)", table).text());
  let 遮陽設施 = $("tr:nth-child(1)>td:nth-child(2)", table).text();
  if (遮陽設施.trim() === "有") {
    設施 += "遮陽設施：有、";
  }
  let 休息區 = $("tr:nth-child(1)>td:nth-child(4)", table).text();
  if (休息區.trim() === "有") {
    設施 += "休息區：有、";
  }
  let 沖洗區 = $("tr:nth-child(2)>td:nth-child(2)", table).text();
  if (沖洗區.trim() === "有") {
    設施 += "沖洗區：有、";
  }
  let 輪椅推車停放區 = $("tr:nth-child(2)>td:nth-child(4)", table).text();
  if (輪椅推車停放區.trim() === "有") {
    設施 += "輪椅推車停放區：有、";
  }
  let 無障礙廁所 = $("tr:nth-child(3)>td:nth-child(2)", table).text();
  if (無障礙廁所.includes("有")) {
    設施 += "無障礙廁所：有、";
  }
  let 哺乳室 = $("tr:nth-child(3)>td:nth-child(4)", table).text();
  if (哺乳室.trim() === "有") {
    設施 += "哺乳室：有、";
  }
  // let 對外開放時間 = $("tr:nth-child(4)>td:nth-child(2)", table).text();
  // if (對外開放時間.includes("有")) {
  //   設施 += "對外開放時間、";
  // }
  let 育嬰室 = $("tr:nth-child(4)>td:nth-child(4)", table).text();
  if (育嬰室.trim() === "有") {
    設施 += "育嬰室：有";
  }
  console.log("設施", 設施);
  park.設施 += "<br />" + 設施;
  console.log(park);
}

async function savePark(park) {
  // getUrlData(park);
  park.id = "高雄市" + park.名稱;
  park.類別 = "特色公園共融遊戲場";
  const payload = {
    id: park.id,
    data: park,
  };
  console.log("============");

  console.log(park);

  await store.saveFunpark(payload);
}

async function updatePark(park) {
  park.id = "高雄市" + park.名稱;
  park.類別 = "特色公園共融遊戲場";
  const payload = {
    id: park.id,
    data: park,
  };
  console.log("============");

  console.log(park);
  await store.updateFunpark(payload);
}
</script>

<script setup>
import proj4 from "proj4";
import Tainan from "../assets/Tainan";

//Proj4js
//https://github.com/proj4js/proj4js

//Chimin: 坐標系統及WebGIS常用的坐標轉換
//https://ithelp.ithome.com.tw/articles/10194371?sc=iThelpR
//其針對EPSG:3828(TWD67)範例有誤

//EPSG:3828錯誤修正
//http://gis.rchss.sinica.edu.tw/qgis/?p=3542
//因目前Proj4對於EPSG:3828（即TM2 TWD67，中央經線121度）的定義不夠完整，因此會造成TM2 TWD 67 <-> TWD97坐標轉換會產生問題，故額外添加「+towgs84」用7參數自訂轉換

//defs
proj4.defs([
  [
    "EPSG:4326",
    "+title=WGS84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
  ],
  [
    "EPSG:3826",
    "+title=TWD97 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
  ],
  [
    "EPSG:3828",
    "+title=TWD67 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +towgs84=-752,-358,-179,-0.0000011698,0.0000018398,0.0000009822,0.00002329 +units=m +no_defs",
  ],
]);

//EPSG
let EPSG3826 = new proj4.Proj("EPSG:3826"); //TWD97 TM2(121分帶)
let EPSG3828 = new proj4.Proj("EPSG:3828"); //TWD67 TM2(121分帶)
let EPSG4326 = new proj4.Proj("EPSG:4326"); //WGS84

//4326轉3826(WGS84經緯度轉TWD97 TM2)
let data1 = proj4(EPSG4326, EPSG3826, [121, 23]);
// document.getElementById('cv4326_3826').innerHTML = data1;
//[250000,2544283.12479424]

//3826轉3828(TWD97 TM2轉TWD67 TM2)
let data2 = proj4(EPSG3826, EPSG3828, data1);
// document.getElementById('cv3826_3828').innerHTML = data2;
//[249171.10594810007, 2544488.5274230908]

//3826轉4326(TWD97 TM2轉WGS84)
let data3 = proj4(EPSG3826, EPSG4326, [178755.678, 2547906.667]);
// document.getElementById('cv3826_4326').innerHTML = data3;
//[249171.10594810007, 2544488.5274230908]

const tnjson = Tainan.map((item) => {
  let x = Number(item.X坐標);
  let y = Number(item.Y坐標);
  let latlng = proj4(EPSG3826, EPSG4326, [x, y]);
  const data = { 設施: "", 簡介: "" };
  (data.lat = latlng[1]), (data.lng = latlng[0]);

  for (let key in item) {
    if (key === "Seq") {
      // data.Seq = item.Seq;
    } else if (key === "編號") {
      // data.編號 = item.編號;
    } else if (key === "縣市") {
      data.縣市 = item.縣市 + item.里別;
    } else if (key === "所在轄區") {
      // data.所在轄區 = item.所在轄區;
    } else if (key === "X坐標") {
      // data.X坐標 = item.X坐標;
    } else if (key === "Y坐標") {
      // data.Y坐標 = item.Y坐標;
    } else if (key === "公園名稱") {
      data.名稱 = item.公園名稱;
    } else if (key === "里別") {
      // data.里別 = item.里別;
    } else if (key === "面積公頃") {
      data.面積公頃 = item.面積公頃;
    } else if (key === "公園全景") {
    } else if (key === "類別") {
      data.類別 = item.類別;
    } else if (key === "座落位置") {
      data.座落位置 = item.座落位置;
    } else if (key === "管理單位") {
    } else if (key === "使用分區") {
    } else if (item[key] !== "") {
      data.設施 += key + ",";
      // console.log(key, item[key]);
    }
  }
  return data;
});
console.log(tnjson);
</script>

<template>
  <div>
    <div style="font-weight: bold">4326轉3826(WGS84經緯度轉TWD97 TM2):</div>
    <div id="cv4326_3826">{{ data1 }}</div>

    <div style="font-weight: bold">3826轉3828(TWD97 TM2轉TWD67 TM2):</div>
    <div id="cv3826_3828">{{ data2 }}</div>

    <div style="font-weight: bold">3826轉4326(TWD97 TM2轉WGS84):</div>
    <div id="cv3826_4326">{{ data3 }}</div>
  </div>
</template>

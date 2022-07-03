<script setup>
import Taipei from "../assets/Taipei";

import Pingtung from "../assets/funMap";

const TaipeiMap = Taipei.map((item) => {
  const data = {
    名稱: item.Col1,
    簡介: item.Col2,
    lng: item.Col3,
    lat: item.Col4,
    設施: "",
    縣市: "台北市" + item.Col11,
    座落位置: item.Col7,
  };
  if (item.Col13) data.設施 += item.Col13 + ",";
  if (item.Col14) data.設施 += item.Col14 + ",";
  if (item.Col15) data.設施 += item.Col15 + ",";
  if (item.Col24) data.設施 += item.Col24 + ",";
  return data;
});

// Col1: "七虎公園"
// Col2: "為位於育仁路上、薇閣小學及七虎泳池之間的小公園，於83，84年間開闢，面積10,098平方公尺，園內設施包括兒童遊樂設施及簡易涼亭各1座，植栽部份則有蜘蛛百合、洋紫荊等，公園中心樟樹群落綠意盎然，臨溪畔近來種有吉野櫻數株，3月期間櫻粉與林綠相互襯托，令人賞心悅目，為薇閣小學及鄰近住戶共享的1處優良綠蔭遊憩場地。"
// Col3: 121.50205994
// Col4: 25.136499405
// Col5: "陽明山公園管理所"
// Col6: 1994
// Col7: "育仁路108號（薇閣小學旁）"
// Col8: 10098
// Col9: "00：00"
// Col10: "24：00"
// Col11: "長安里"
// Col12: ""
// Col13: "游泳池"
// Col14: "組合遊具"
// Col15: "涼亭"
// Col16: ""
// Col17: "北投公園站:216區, 218, 218區, 218直達車, 223, 266, 602,230,小6, 小7,小25,小26,小9,市民小巴2"
// Col18: "Qihu Park"
// Col19: ""
// Col20: "公園"
// Col21: "共融"
// Col22: 280
// Col23: ""
// Col24: "彈跳床,搖滾盤,攀爬組,磨石滑梯"
console.log(TaipeiMap);

// 轉換成陣列
const PingtungMap = Object.keys(Pingtung).map((key) => {
  const data = {
    名稱: Pingtung[key].name,
    簡介: Pingtung[key].Introduction,
    lng: Pingtung[key].lng,
    lat: Pingtung[key].lat,
    設施: "",
    縣市: "屏東縣",
    座落位置: "",
  };
  return data;
});
console.log(PingtungMap);
</script>

<template>
  <div></div>
</template>

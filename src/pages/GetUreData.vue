<template>
  <div>
    <div v-html="tx"></div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, toRefs } from "vue";
import { api, request } from "src/boot/axios.js";
const cheerio = require("cheerio");

const dh = ref(null);
const tx = ref(null);

let apiUrl =
  process.env.API +
  "News_Content.aspx?n=4773608F226124D4&sms=7B56BA5392EB632C&s=E9C4254FCD906D5B";

geturldata();
function geturldata() {
  const urldata = api
    .get(apiUrl)
    .then((result) => {
      // console.log("urldata", result.data);
      const $ = cheerio.load(result.data);
      // console.log($); //是function型態

      $("#base-content").text();
      tx.value = $("#CCMS_Content").html();
      // console.log($("#CCMS_Content .h3").text());

      // console.log($("div", "#CCMS_Content .playground").text());
      // console.log($("div", "#CCMS_Content .playground").html());
      // console.log($("#CCMS_Content .playground  div").html()); //跟上面一樣
      // console.log(divEL.querySelector("img")); //錯誤
      // console.log($("img", "#CCMS_Content .playground"));
      const imgEL = $("img", "#CCMS_Content .playground");
      imgEL.each((i, item) => {
        console.log($(item).attr("src"));
      });
      // 以下兩種循環方式一樣
      // imgEL.each((key) => {
      //   console.log(imgEL[key].attribs.src);
      // });
      // for (let key in imgEL) {
      //   console.log(key, imgEL[key].attribs.src);
      // }

      // console.log($("table", "#CCMS_Content .playground").html()); //只能顯示第一個table
      // const table = $("#CCMS_Content .playground table"); //共有4個table
      // console.log(table);
      const tableEL = $("table"); //共有4個table

      tableEL.each((key, item) => {
        // console.log(item); //item物件型態 ，$(item) cheerio function 型態
        $("tr th , tr td , img", item).each((i, elem) => {
          console.log("table" + key, i, $(elem).text());
        });
        console.log($("img", item).attr("src"));
      });

      // var parser = new DOMParser();
      // var doc = parser.parseFromString(result.data, "text/xml");
      // console.log(doc.querySelector("table"));
      // dh.value = doc.querySelector("table").innerText;
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

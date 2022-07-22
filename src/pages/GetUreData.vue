<template>
  <div></div>
</template>
<script setup>
import { api, request } from "src/boot/axios.js";

let apiUrl =
  process.env.API +
  "News_Content.aspx?n=4773608F226124D4&sms=7B56BA5392EB632C&s=E9C4254FCD906D5B";

geturldata();
function geturldata() {
  const urldata = api
    .get(apiUrl)
    .then((result) => {
      // console.log("urldata", result.data);
      let dh = result.data;
      console.log(dh);
    })
    .catch((err) => {
      // this.locationError()
    });
}

// getData4() {
//   let apiUrl =
//     process.env.API + "/api/covid19?CK=covid-19@nchc.org.tw&querydata=2001";
//   this.$axios
//     .get(apiUrl, {
//       // "Access-Control-Allow-Origin": "*",
//       // "Access-Control-Allow-Headers": "content-type",
//     })
//     .then((result) => {
//       console.log("CDB疫苗資訊", result);
//     })
//     .catch((err) => {
//       // this.locationError()
//     });
// },
</script>

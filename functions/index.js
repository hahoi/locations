const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();



exports.sendCode = functions.https.onRequest((req, res) => {
  let query = req.query;
  console.log(query)

  // return getData = axios({
  //   method: 'post',
  //   url: 'https://biz3.every8d.com.tw/monthly/API21/HTTP/sendsms.ashx',
  //   params: {
  //     UID: 91005200,
  //     PWD: '@Pthg251013@',
  //     SB: 'test',
  //     MSG: '驗證碼：' + code,
  //     DEST: phone
  //   }
  // }).then(async (response) => {
  //   console.log("response.data", response.data)
  //   let num = parseFloat(response.data.split(',')[0])
  //   if (num > 0) {
  //     validatePhoneCode.push({
  //       'phone': phone,
  //       'code': code
  //     })
  //     console.log("SMS ", validatePhoneCode);
  //     return res.send({
  //       code: 200,
  //       msg: '發送成功。' + '驗證碼：' + code
  //     });
  //   } else {
  //     return res.send({
  //       code: 400,
  //       msg: '發送失敗' + response.data
  //     });
  //   }

  // }).catch(err => {
  //   return res.send('error: ' + err);
  // })


  // return axios({
  //   method: 'post',
  //   url: 'https://biz3.every8d.com.tw/monthly/API21/HTTP/sendsms.ashx',
  //   params: {
  //     UID: 91005200,
  //     PWD: '@Pthg251013@',
  //     SB: 'swell',
  //     MSG: data.smstext,
  //     DEST: data.phone,
  //   },
  //   timeout: 10000 //加長等待時間

  // }).then(async (res) => {
  //   await console.log(res.data) //若沒有等待，回傳會是null
  //   return res.data
  // })
  //   .catch(err => {
  //     console.log(err)
  //     return err
  //   })


})


exports.app = functions.https.onRequest(app);  //瀏覽器 https://us-central1-orsonapi.cloudfunctions.net/app

const axios = require("axios")
const path = require('path');
const https = require('https');
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
const rootCas = require('ssl-root-cas').create();
// 适用于所有请求 (不论是直接用 https 还是用其他的请求模块)
https.globalAgent.options.ca = rootCas;
const httpsAgent = new https.Agent({ ca: rootCas });

exports.getVaccinationRate = functions.region('asia-east1').https.onRequest((req, res) => {

  return cors(req, res, () => {

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
    } else {
      // res.send('Hello World!');
    }

    // return axios({
    //     method: 'get',
    //     // url: req.query.url //設定接受 query 參數 url ，接受要取的 api 網址，可依照需求增加
    //     url: 'https://covid-19.nchc.org.tw/api/covid19?CK=covid-19@nchc.org.tw&querydata=2001'
    //     // url: 'https://soweb.kcg.gov.tw/open1999/ServiceRequestsQuery.asmx/ServiceRequestsQuery?startdate=&enddate='
    //     'https://autumnfish.cn//personalized/mv
    // })

    return axios.get('http://covid-19.nchc.org.tw/api/covid19?CK=covid-19@nchc.org.tw&querydata=2001', { httpsAgent })
      .then((response) => {
        // console.log("response.data", response.data)
        return res.send(response.data);
      }).catch(err => {
        return res.send('error: ' + err);
      })



  });

});


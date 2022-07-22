import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: '' })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

const request = axios.create({
  // baseURL: process.env.DEV ? '/api' : 'https://autumnfish.cn/',
  baseURL: process.env.API,
  timeout: 5000
})

request.interceptors.request.use(
  function (config) {
    // NProgress.start(0.2)
    return config
  },
  function (err) {
    console.log(err)
  }
)

request.interceptors.response.use(
  function (res) {
    // NProgress.done()
    return res.data
  },
  function (err) {
    console.log(err)
  }
)

/*在本機呼叫會有跨域問題，因是用user瀏覽器執行，而非server 對 server*/
// const sendSMStext = (phone, SMSText) => {
//   // console.log(phone, SMSText)
//   // return
//   request({
//     method: 'post',
//     url: '/monthly/API21/HTTP/sendsms.ashx', //不須加domain name，已設定在baseURL
//     params: {
//       UID: 91005200,
//       PWD: '@Pthg251013@',
//       SB: 'swell-1',
//       MSG: SMSText,
//       DEST: phone
//     }
//   })
// }

export { api, request };

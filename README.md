<script
      async
      defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIp6u_X-pnki-DLedgYWMPQskFSIrstaE&libraries=places"
    ></script>


1. 在 .gitgnore 中加入
/src/utils/firebase-config.js

2. 把 firebase-config.js 拷貝到另一處
3. 推送到遠端
4. 把 firebase-config.js 拷貝還原到 /src/utils/




quasar build
firebase deploy --only hosting:funpark


```pwa```
quasar build -m pwa
firebase deploy --only hosting:funparkpwa

icongenie generate -m pwa --icon .\src\assets\fun-park_.png




npm i firebase
npm install v-viewer@next
npm install --save @googlemaps/js-api-loader
npm install --save @googlemaps/markerclusterer
npm install --save image-conversion


npm install cheerio



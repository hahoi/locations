<template>
  <q-page style="max-width: 800px; margin: auto">
    <h5 class="text-center">手機驗證登錄</h5>

    <div
      class="flex column flex justify-center items-center q-gutter-y-sm q-pa-md"
    >
      <div class="row flex justify-around text-white">
        <q-input
          v-model="data.mobilePhone"
          label="請輸入手機號碼"
          outlined
          clearable
          class="col-7 text-h6"
        />
        <q-btn
          @click="send()"
          color="cyan-6"
          label="發送簡訊"
          class="col-4 text-body1 g-recaptcha"
          data-sitekey="6LcvOQ8hAAAAAIwMJh7765581GJjLeApSx1NwD8X"
        />
      </div>

      <div class="row flex justify-around q-pt-md" v-if="data.codeOK">
        <q-input
          v-model="data.code"
          label="驗證碼"
          outlined
          class="col-7 text-h6"
        />
        <q-btn
          @click="sendcode()"
          color="info"
          label="驗 證"
          class="col-4 text-body1 g-recaptcha"
        />
      </div>
      <div class="text-red text-subtitle1 q-mt-lg">
        此行動電話僅用於取得簡訊密碼登入用
      </div>
    </div>

    <div id="recaptcha-container"></div>

    <form>
      Name: (required) <input id="field" ref="field" name="field" />
      <div
        id="recaptcha"
        class="g-recaptcha"
        data-sitekey="6LcvOQ8hAAAAAIwMJh7765581GJjLeApSx1NwD8X"
        data-callback="onSubmit"
        data-size="invisible"
      ></div>
      <button id="submit" ref="submit">submit</button>
    </form>
    <!-- <div
      id="recaptcha-container"
      class="g-recaptcha"
      data-sitekey="6LcvOQ8hAAAAAIwMJh7765581GJjLeApSx1NwD8X"
      data-size="invisible"
    ></div> -->
    <!-- data-size="invisible"  隱形看不到-->

    <!-- <q-btn
      label="發送簡訊"
      class="g-recaptcha"
      data-sitekey="6LcvOQ8hAAAAAIwMJh7765581GJjLeApSx1NwD8X"
      data-callback=""
      data-size="invisible"
      @click="send()"
    >
    </q-btn> -->
  </q-page>
</template>
<script setup>
import { onMounted, computed, reactive, ref, toRefs, watchEffect } from "vue";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { authStore } from "stores/auth";
import { getFirebaseConfig } from "src/utils/firebase-config.js";

import { uid, date, Notify, extend, useQuasar } from "quasar";
import { showErrorMessage } from "src/utils/function-show-error-message";

// const firebaseApp = initializeApp(getFirebaseConfig());
// const appCheck = initializeAppCheck(firebaseApp, {
//   provider: new ReCaptchaEnterpriseProvider(
//     "6LeRhBchAAAAAMZ0B7GIdS6FB3xE3mJxvCEh8Pj8"
//   ),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true,
// });

const $q = useQuasar();
const store = authStore();
const field = ref(null);
const submit = ref(null);

function onSubmit(token) {
  alert("thanks " + field.value.value);
  const regex = /^09[0-9]{8}$/;

  if (regex.test(data.mobilePhone)) {
    let phoneNumber = "+886" + data.mobilePhone.slice(1, 10);
    // console.log(phoneNumber);
    // console.log("0" + phoneNumber.slice(4, 14));

    const appVerifier = window.recaptchaVerifier;
    // console.log(appVerifier);

    signInWithPhoneNumber(getAuth(), phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // console.log(confirmationResult);
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        /* 發送成功 */
        window.confirmationResult = confirmationResult;
        data.codeOK = true;
        // ...
      })
      .catch((error) => {
        /* 發送失敗 */
        showErrorMessage("發送失敗");
        console.log(error);
        /* 重置驗證 */
        grecaptcha.reset(window.recaptchaWidgetId);
      });
  } else {
    showErrorMessage("電話格式錯誤!");
    return false;
  }
}

function validate(event) {
  event.preventDefault();
  grecaptcha.execute();
  console.log(field.value);

  if (!field.value) {
    alert("You must add text to the required field");
  } else {
    grecaptcha.execute();
  }
}

function onload() {
  var element = ref.submit.value;
  console.log(element);
  element.onclick = validate;
}

//---------- data ----------
const data = reactive({
  code: "",
  codeOK: false,
  mobilePhone: "",
});

onMounted(() => {
  // grecaptcha.ready(function () {
  //   grecaptcha.render("recaptcha-container", {
  //     sitekey: "6LcvOQ8hAAAAAIwMJh7765581GJjLeApSx1NwD8X",
  //   });
  // });
  const auth = getAuth();
  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {
      // size: "invisible",
      callback: (response) => {
        console.log(response);
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        console.log("onmounted", response);
      },
      "expired-callback": () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      },
    },
    auth
  );
});

function send() {
  // grecaptcha.enterprise.ready(async () => {
  //   const token = await grecaptcha.enterprise.execute(
  //     "6LeRhBchAAAAAMZ0B7GIdS6FB3xE3mJxvCEh8Pj8",
  //     { action: "LOGIN" } //action 可參考此網頁，https://cloud.google.com/recaptcha-enterprise/docs/actions
  //   );
  //   console.log(token);
  //   // IMPORTANT: The 'token' that results from execute is an encrypted response sent by
  //   // reCAPTCHA Enterprise to the end user's browser.
  //   // This token must be validated by creating an assessment.
  //   // See https://cloud.google.com/recaptcha-enterprise/docs/create-assessment
  // });

  // const phoneNumber = "+886978637387";
  const regex = /^09[0-9]{8}$/;

  if (regex.test(data.mobilePhone)) {
    let phoneNumber = "+886" + data.mobilePhone.slice(1, 10);
    // console.log(phoneNumber);
    // console.log("0" + phoneNumber.slice(4, 14));

    const appVerifier = window.recaptchaVerifier;
    // console.log(appVerifier);

    signInWithPhoneNumber(getAuth(), phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // console.log(confirmationResult);
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        /* 發送成功 */
        window.confirmationResult = confirmationResult;
        data.codeOK = true;
        // ...
      })
      .catch((error) => {
        /* 發送失敗 */
        showErrorMessage("發送失敗");
        console.log(error);
        /* 重置驗證 */
        grecaptcha.reset(window.recaptchaWidgetId);
      });
  } else {
    showErrorMessage("電話格式錯誤!");
    return false;
  }
}
function sendcode() {
  // console.log(data.code);
  /* 檢查驗證碼 */
  confirmationResult
    .confirm(data.code)
    .then(async function (result) {
      /* 驗證成功 */
      var user = result.user;
      // const currentToken = await getToken(getMessaging());
      // console.log("currentToken", currentToken);
    })
    .catch(function (error) {
      /* 驗證失敗 */
      if (error.message == "TOO_MANY_ATTEMPTS_TRY_LATER") {
        showErrorMessage("發送太多次驗證碼，驗證失敗！");
      } else {
        showErrorMessage("驗證失敗");
      }
      console.log(error);
    });
}
</script>

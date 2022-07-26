<template>
  <q-page style="max-width: 600px; margin: auto">
    <h5 class="text-center">驗證登錄</h5>

    <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
      <q-tab class="text-info" name="phone" label="手機號碼" />
      <q-tab class="text-orange" name="google" label="Google" />
    </q-tabs>

    <div class="q-gutter-y-sm">
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="text-white text-center"
      >
        <q-tab-panel name="phone">
          <div class="row flex justify-around text-white">
            <q-input
              v-model="mobilePhone"
              label="請輸入手機號碼"
              outlined
              clearable
              class="col-7 text-h6"
            />
            <q-btn
              @click="send()"
              color="cyan-6"
              label="發送簡訊"
              class="col-4 text-body1"
            />
          </div>

          <div class="row flex justify-around q-pt-md" v-if="codeOK">
            <q-input
              v-model="code"
              label="驗證碼"
              outlined
              class="col-7 text-h6"
            />
            <q-btn
              @click="sendcode()"
              color="info"
              label="驗 證"
              class="col-4 text-body1"
            />
          </div>
          <div class="text-red text-subtitle1 q-mt-lg">
            此行動電話僅用於取得簡訊密碼登入用
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="fade"
        transition-next="fade"
        class="text-white text-center"
      >
        <q-tab-panel name="google"
          ><q-btn
            unelevated
            rounded
            color="orange"
            label="Google帳戶登入"
            class="text-h6"
            @click="googleSignIn()"
          ></q-btn>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div id="recaptcha-container"></div>
  </q-page>
</template>

<script>
import {
  defineComponent,
  onMounted,
  computed,
  reactive,
  ref,
  toRefs,
  watchEffect,
} from "vue";
import { uid, date, Notify, extend, useQuasar } from "quasar";
import { showErrorMessage } from "src/utils/function-show-error-message";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default defineComponent({
  name: "auth",
  props: {},
  components: {},
  emits: [""],
  setup(props, context) {
    const $q = useQuasar();

    //---------- data ----------
    const data = reactive({
      tab: "phone",
      code: "",
      codeOK: false,
      mobilePhone: "",
    });

    // const a = computed(() => state.name);

    onMounted(() => {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // console.log("signInWithPhoneNumber");
            onSignInSubmit();
          },
        },
        getAuth()
      );
    });

    function send() {
      // const phoneNumber = "+886978637387";
      const regex = /^09[0-9]{8}$/;

      if (regex.test(data.mobilePhone)) {
        let phoneNumber = "+886" + data.mobilePhone.slice(1, 10);
        // console.log(phoneNumber);
        // console.log("0" + phoneNumber.slice(4, 14));
        const appVerifier = window.recaptchaVerifier;

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

    async function googleSignIn() {
      // Sign in Firebase using popup auth and Google as the identity provider.
      var provider = new GoogleAuthProvider();
      await signInWithPopup(getAuth(), provider);
    }
    return {
      ...toRefs(vuex),
      ...toRefs(data),
      send,
      sendcode,
      googleSignIn,
    };
  },
});
</script>
<style>
.q-tab__label {
  font-size: 1.5rem;
}
</style>

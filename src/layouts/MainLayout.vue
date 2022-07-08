<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        /> -->
        <div class="q-ma-xs">
          <div v-if="showBackIcon">
            <q-btn
              round
              icon="reply"
              dense
              color="indigo"
              @click="$router.back()"
            >
            </q-btn>
          </div>
        </div>

        <!-- $router.push('/') -->
        <q-toolbar-title class="text-center text-h5" @click="reload()">
          <q-img
            src="../assets/好玩公園-無背景PNG.png"
            style="width: 40px"
          ></q-img>
          爸媽去哪裡玩
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-2 text-white">
      <q-toolbar class="q-px-none">
        <q-toolbar-title>
          <div class="row justify-around no-wrap">
            <q-btn color="amber" text-color="black" class="col-grow" to="/">
              <q-icon left size="2em" name="home" class="text-blue-14" />
              <div class="text-h6 text-blue-14">Home</div>
            </q-btn>

            <q-btn
              color="deep-orange"
              glossy
              text-color="white"
              class="col-grow"
              to="/FunPark/list"
            >
              <q-icon left size="2em" name="park" />
              <div class="text-h6">找公園</div>
            </q-btn>

            <q-btn
              color="secondary"
              glossy
              text-color="black"
              class="col-grow"
              to="/FunPark/map"
            >
              <q-icon left size="2em" name="pin_drop" />
              <div class="text-h6">看地圖</div>
            </q-btn>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import {
  defineComponent,
  onMounted,
  computed,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import EssentialLink from "components/EssentialLink.vue";
import { locationStore } from "stores/location";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const store = locationStore();

    const router = useRouter();
    const route = useRoute();
    const leftDrawerOpen = ref(false);

    //載入資料庫資料
    reload();

    //---------- data ----------
    const data = reactive({
      // 顯示倒退按鈕
      showBackIcon: false,
    });
    // 將要顯示倒退按鈕的頁面，放在此陣列中
    const backRoute = [
      "showPark",
      "parkingLot",
      "Bathroom",
      "DiningSnacks",
      "ConvenienceStore",
      "edit",
    ];

    // 監視頁面跳轉
    watch(
      () => route.name,
      () => {
        // console.log(`${route.name}`);
        data.showBackIcon = inArray(route.name, backRoute);
      }
    );

    function inArray(value, arr) {
      for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i] === value) {
          return true;
        }
      }
      return false;
    }

    function reload() {
      //更新
      store.set_dataReady(false);
      store.queryFunParks();
      // window.location.reload(true);
    }

    return {
      ...toRefs(data),

      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      reload,
    };
  },
});
</script>

<template>
  <q-page class="" style="max-width: 800px; margin: auto">
    <div class="q-pa-md">
      <h4 class="text-center">資料管理</h4>
      <div class="q-gutter-y-md">
        <q-option-group
          v-model="panel"
          inline
          :options="[
            { label: '公園介紹', value: '公園介紹' },
            { label: '廁所', value: '廁所' },
            { label: '停車場', value: '停車場' },
            { label: '附近美食', value: '附近美食' },
            { label: '便利商店', value: '便利商店' },
          ]"
          class="text-center text-h5"
        />

        <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
          <q-tab-panel name="公園介紹">
            <!-- 基本資料 -->
            <park :location="location"></park>
            <!-- 已有的段落內容 -->
            <content :location="location"></content>
            <!-- 新增段落內容 -->
            <appendContent :location="location"></appendContent>
            <div><br /><br /><br /></div>
          </q-tab-panel>

          <q-tab-panel name="廁所">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="停車場">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="附近美食">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="便利商店">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, computed, reactive, ref, toRefs, watchEffect } from "vue";

import { useRouter, useRoute } from "vue-router";
import { locationStore } from "stores/location";

import park from "src/components/mana/park";
import content from "src/components/mana/content";
import appendContent from "src/components/mana/appendContent";

const router = useRouter();
const route = useRoute();

const id = route.params.parkId;
const store = locationStore();
const location = store.locationsFilteredArray.find((item) => id == item.id);

const panel = ref("公園介紹");
</script>

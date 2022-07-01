<template>
  <div class="">
    <Search></Search>
    <!-- List選項 -->
    <q-list bordered separator>
      <q-infinite-scroll @load="loadMore" :offset="100">
        <div v-for="(item, key) in showingData" :key="key">
          <q-item
            clickable
            v-ripple
            :to="{ name: 'showPark', params: { parkId: item.id } }"
          >
            <q-item-section>
              <q-item-label class="text-h6">{{ item.name }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <template>
                <q-chip
                  color="deep-orange"
                  text-color="white"
                  icon-right="directions"
                >
                </q-chip>
              </template>
            </q-item-section>
          </q-item>
          <q-separator />
        </div>
      </q-infinite-scroll>
    </q-list>
    <!-- {{ props.locations }} -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, toRefs } from "vue";
import { locationStore } from "stores/location";
import Search from "./search.vue";

const props = defineProps({
  locations: Array,
});

// 捲動分頁載入
const timer = null;
let start = 0;
let offset = 3;
let actualPosition = ref(3);
const showingData = computed(() => {
  return props.locations.slice(0, actualPosition.value);
});
function loadMore(index, done) {
  if (
    // 一開始還沒讀入資料庫RepairCases.length = 0
    props.locations.length != 0 &&
    actualPosition.value > props.locations.length
  )
    return;
  const timer = setTimeout(() => {
    //分段取得累計值
    actualPosition.value += offset;
    done(timer);
  }, 100);
}
function done(timer) {
  clearTimeout(timer);
}
</script>

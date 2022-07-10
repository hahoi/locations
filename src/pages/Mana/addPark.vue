<template>
  <div class="" style="max-width: 800px; margin: auto">
    <q-card>
      <q-card-section>
        <div class="q-ma-md row items-start">
          <q-input
            ref="ref1"
            v-model="park.縣市"
            label="縣市"
            class="full-width text-h6"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon name="close" @click="park.縣市 = ''" />
            </template>
          </q-input>
        </div>
        <div class="q-ma-md row items-start">
          <q-input
            ref="ref2"
            v-model="park.名稱"
            label="名稱"
            class="full-width text-h6"
            :rules="[(val) => !!val || '不能空白，必填']"
          >
            <template v-slot:append>
              <q-icon name="close" @click="park.名稱 = ''" />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions vertical>
        <q-btn class="bg-positive" label="存檔" @click="addParkSave"></q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script setup>
import { onMounted, computed, reactive, ref, toRefs, watchEffect } from "vue";
import { locationStore } from "stores/location";
const store = locationStore();

const ref1 = ref(null);
const ref2 = ref(null);
const park = reactive({
  id: "",
  名稱: "",
  簡介: "",
  介紹: "",
  lng: 23.855211,
  lat: 120.922269,
  設施: "",
  縣市: "",
  區域: "",
  位置: "",
  navi: "",
  便利商店: [],
  段落: [],
  停車場: [],
  廁所: [],
  附近美食: [],
});
async function addParkSave() {
  park.id = park.縣市 + park.名稱;
  // console.log(ref1.value.validate(), ref2.value.validate());
  if (ref1.value.validate() && ref2.value.validate()) {
    const payload = {
      id: park.id,
      data: park,
    };
    await store.saveFunpark(payload);
    await store.queryFunParks();
    store.set_search(park.id);
  }
}
</script>

<template>
  <div>
    <transition
      appear
      enter-active-class="animated animate__bounceOut"
      leave-active-class="animated animate__heartBeat"
    >
      <q-input
        clearable
        color="secondary"
        v-model="searchField"
        label="關鍵字查詢，多個關鍵字用空白隔開"
        @keyup.esc="searchField = ''"
        outlined
        class=""
        style="border: 1px solid #33ff00; border-radius: 5px"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, toRefs } from "vue";
import { locationStore } from "stores/location";

//---------- pinia ----------
const store = locationStore();

const searchField = computed({
  get: () => {
    return store.search;
  },
  set: (val) => {
    let str = val || "";
    store.set_search(str);
  },
});
</script>
<style>
button.q-icon.notranslate.material-icons.q-field__focusable-action {
  color: red;
}
</style>

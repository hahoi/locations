<template>
  <div style="max-width: 800px; margin: auto">
    <router-view v-slot="{ Component }">
      <transition :name="route.meta.transition || 'fade'">
        <keep-alive>
          <component
            :is="Component"
            :key="$route.name"
            v-if="$route.meta.keepAlive"
          />
        </keep-alive>
      </transition>
      <component
        :is="Component"
        :key="$route.name"
        v-if="!$route.meta.keepAlive"
      />
    </router-view>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "index",
  props: {},
  components: {},
  emits: [""],
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    return {
      router,
      route,
    };
  },
});
</script>

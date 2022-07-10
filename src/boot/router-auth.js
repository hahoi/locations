import { locationStore } from "stores/location";

export default ({ router }) => {
  const store = locationStore();

  router.beforeEach((to, from, next) => {
    // console.log(store.normalRouter, from.path, to.path)
    if (false) {
    }
    else {
      next()
    }
  })
}

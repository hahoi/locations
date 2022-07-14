import { locationStore } from "stores/location";

export default ({ router }) => {
  const store = locationStore();

  router.beforeEach((to, from, next) => {
    console.log(store.locationDataReady, from.path, to.path)
    if (!store.locationDataReady && to.path !== '/') {
      next('/')
    }
    else {
      next()
    }
  })
}

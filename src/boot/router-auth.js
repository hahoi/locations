import { locationStore } from "stores/location";

export default ({ router }) => {
  const store = locationStore();

  router.beforeEach((to, from, next) => {
    // console.log(store.locationDataReady, "from :", from.path, "to ->", to.path)
    if (!store.locationDataReady && to.path !== '/FunPark') {
      next()
    } else if (!store.locationDataReady && to.path !== '/') {
      next('/')
      // } else if (!store.locationDataReady) {
      //   next('/')
    }
    else {
      next()
    }

    // if (!store.locationDataReady && to.path !== '/') {
    //   next('/')
    // }
    // else {
    //   next()
    // }

  })
}

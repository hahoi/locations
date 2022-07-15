
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '', component: () => import('pages/Index3Page.vue') },
      // { path: 'writeToFirestore', component: () => import('pages/writeToFirestore.vue') },
      // { path: 'Tainan', component: () => import('pages/Tainan.vue') },
      // { path: 'Taipei', component: () => import('pages/Taipei.vue') },
      { path: 'gmplace', component: () => import('pages/gmplace.vue') },
      {
        path: '/mana',
        component: () => import('src/pages/Mana/index.vue'),
        children: [
          { path: '', component: () => import('pages/Mana/parkList.vue') },
          { path: 'list', component: () => import('pages/Mana/parkList.vue') },
          {
            path: 'edit/:parkId',
            name: 'edit',
            component: () => import('pages/Mana/edit.vue')
          },
        ]
      },
      {
        path: '/FunPark',
        component: () => import('src/pages/FunPark/index.vue'),
        // meta: { title: '公園', role: '', icon: 'home', divider: true },
        children: [
          {
            // name: "funparks",
            path: "tab",
            component: () => import("src/pages/FunPark/TabPage.vue"),
            meta: { transition: 'slide-left', keepAlive: true, }
          },
          {
            path: "list",
            name: "ParkList",
            component: () => import("src/pages/FunPark/ParkListPage.vue"),
            meta: { transition: 'slide-left', keepAlive: true, },
          },
          {
            path: "map",
            name: "ParkMap",
            component: () => import("src/pages/FunPark/ParkMapPage.vue"),
            meta: { transition: 'slide-left', }
          },
          {
            path: "showPark/:parkId",
            name: "showPark",
            component: () => import("src/pages/FunPark/ShowPark.vue"),
            meta: { transition: 'slide-left' }
          },
          {
            path: "Bathroom/:parkId",
            name: "Bathroom",
            component: () => import("src/components/Surrounding/Bathroom.vue"),
            meta: { transition: 'slide-left' }
          },
          {
            path: "parkingLot/:parkId",
            name: "parkingLot",
            component: () => import("src/components/Surrounding/ParkingLot.vue"),
            meta: { transition: 'slide-left' }
          },
          {
            path: "DiningSnacks/:parkId",
            name: "DiningSnacks",
            component: () => import("src/components/Surrounding/DiningSnacks.vue"),
            meta: { transition: 'slide-left' }
          },
          {
            path: "ConvenienceStore/:parkId",
            name: "ConvenienceStore",
            component: () => import("src/components/Surrounding/ConvenienceStore.vue"),
            meta: { transition: 'slide-left' }
          },
        ]
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

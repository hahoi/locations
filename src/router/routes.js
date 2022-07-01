
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/funpark',
        component: () => import('src/pages/FunPark/index.vue'),
        meta: { title: '公園', role: '', icon: 'home', divider: true },
        children: [
          {
            // name: "funparks",
            path: "",
            component: () => import("src/pages/FunPark/LocationPage.vue"),
            meta: { transition: 'slide-left', keepAlive: true, }
          },
          {
            path: "showPark/:parkId",
            name: "showPark",
            component: () => import("src/components/ShowPark.vue"),
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

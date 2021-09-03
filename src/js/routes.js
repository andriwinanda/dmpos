import AboutPage from '../pages/about.vue';
import FormPage from '../pages/form.vue';

import LeftPage1 from '../pages/left-page-1.vue';
import LeftPage2 from '../pages/left-page-2.vue';
import DynamicRoutePage from '../pages/dynamic-route.vue';
import RequestAndLoad from '../pages/request-and-load.vue';
import NotFoundPage from '../pages/404.vue';


// Routes
import store from '../store/store'

import HomePage from '../pages/home.vue';
import Login from '../pages/login.vue';
import GetUrl from '../pages/get-url.vue';
import Contact from '../pages/contact.vue';
import Product from '../pages/product.vue';
import Transaction from '../pages/transaction.vue';
import ProductDetail from '../pages/product-detail.vue';
import Sales from '../pages/sales.vue';
import Payment from '../pages/payment.vue';
import Report from '../pages/report.vue';
import Help from '../pages/help.vue';

// function securedRoute(path, component) {
//   return {
//     path,
//     reloadCurrent: true,
//     async(to, from, resolve) {
//       let baseUrl = localStorage.getItem("baseUrl");
//       let token = localStorage.getItem("glmobile-token");

//       if (to.path !== '/login' && to.path != '/get_url') {
//         if (!baseUrl) {
//           store.dispatch("login/logout")
//           resolve({ path: '/get_url' })
//         } else if (!token) {
//           store.dispatch("login/logout")
//           resolve({ path: '/login' })
//         } else {
//           resolve(component)
//         }
//       }
//     }
//   }
// }
var routes = [
  {
    path: '/',
    component: HomePage,
    preloadPreviousPage : false

    // reloadCurrent: true //Reload current for reload current page
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/get-url',
    component: GetUrl
  },
  {
    path: '/contact',
    component: Contact
  },
  {
    path: '/product',
    component: Product
  },
  {
    path: '/transaction',
    component: Transaction
  },
  {
    path: '/product-detail',
    component: ProductDetail
  },
  {
    path: '/sales',
    component: Sales
  },
  {
    path: '/report',
    component: Report
  },
  {
    path: '/payment/:id',
    component: Payment
  },
  {
    path: '/help',
    component: Help
  },
  




  // {
  //   path: '/about/',
  //   component: AboutPage,
  // },
  // {
  //   path: '/form/',
  //   component: FormPage,
  // },

  // {
  //   path: '/left-page-1/',
  //   component: LeftPage1,
  // },
  // {
  //   path: '/left-page-2/',
  //   component: LeftPage2,
  // },
  // {
  //   path: '/dynamic-route/blog/:blogId/post/:postId/',
  //   component: DynamicRoutePage,
  // },
  // {
  //   path: '/request-and-load/user/:userId/',
  //   async: function (routeTo, routeFrom, resolve, reject) {
  //     // Router instance
  //     var router = this;

  //     // App instance
  //     var app = router.app;

  //     // Show Preloader
  //     app.preloader.show();

  //     // User ID from request
  //     var userId = routeTo.params.userId;

  //     // Simulate Ajax Request
  //     setTimeout(function () {
  //       // We got user data from request
  //       var user = {
  //         firstName: 'Vladimir',
  //         lastName: 'Kharlampidi',
  //         about: 'Hello, i am creator of Framework7! Hope you like it!',
  //         links: [
  //           {
  //             title: 'Framework7 Website',
  //             url: 'http://framework7.io',
  //           },
  //           {
  //             title: 'Framework7 Forum',
  //             url: 'http://forum.framework7.io',
  //           },
  //         ]
  //       };
  //       // Hide Preloader
  //       app.preloader.hide();

  //       // Resolve route to load page
  //       resolve(
  //         {
  //           component: RequestAndLoad,
  //         },
  //         {
  //           context: {
  //             user: user,
  //           }
  //         }
  //       );
  //     }, 1000);
  //   },
  // },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

routes.reloadCurrent = true
routes.mode = 'history'
export default routes;

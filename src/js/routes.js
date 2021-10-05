import AboutPage from '../pages/about.vue';
import FormPage from '../pages/form.vue';
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
    path: '/help',
    component: Help
  },
    {
    path: '(.*)',
    component: NotFoundPage,
  },
];

routes.reloadCurrent = true
routes.mode = 'history'
export default routes;

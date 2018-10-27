import Vue from 'vue'
import './pollyfills'
import VueRouter from 'vue-router'
import VueNotify from 'vue-notifyjs'
import VeeValidate from 'vee-validate'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import App from './App.vue'
import { store } from './store/store'
// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'
import initProgress from './progressbar';

// router setup
import routes from './routes/routes'

// library imports

import './assets/sass/paper-dashboard.scss'
import './assets/sass/element_variables.scss'
import './assets/sass/demo.scss'

import sidebarLinks from './sidebarLinks'

import Amplify, * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';
import aws_exports from './aws-exports';
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";

Amplify.configure(aws_exports);
Vue.use(AmplifyPlugin, AmplifyModules);

Vue.config.productionTip = false

// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar, { sidebarLinks: sidebarLinks })
Vue.use(VeeValidate)
locale.use(lang)


// stripe 
import VueStripeCheckout from 'vue-stripe-checkout';
 
const options = {
  key: process.env.VUE_APP_STRIPE_KEY,
  image: 'https://i.imgur.com/1PHlmFF.jpg',
  locale: 'auto',
  currency: 'USD',
  billingAddress: false,
  panelLabel: 'Subscribe'
}
 
Vue.use(VueStripeCheckout, options);

//paypal 
import PayPal from 'vue-paypal-checkout'
Vue.component('paypal-checkout', PayPal)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  console.log(to.fullPath)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    
    Auth.currentAuthenticatedUser()
      .then(async user => {
        if (!user) {
          next({ path: '/signin', query: { redirect: to.fullPath }});
          return;
        }

        let session = await Auth.currentSession();
        localStorage.setItem("jwtToken", session.idToken.jwtToken)
        next();
      })
      .catch(e => {
        next({ path: '/signin', query: { redirect: to.fullPath }})
      } );
      
  } else {
    next();
  }
});

initProgress(router);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
  router
})

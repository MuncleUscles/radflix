import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import VueResource from 'vue-resource'
import 'buefy/dist/buefy.css';

Vue.config.productionTip = false;


Vue.use(Buefy);
Vue.use(VueResource);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

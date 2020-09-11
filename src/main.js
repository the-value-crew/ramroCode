import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import './styles/main.scss';

Vue.component('VueSlider', VueSlider)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

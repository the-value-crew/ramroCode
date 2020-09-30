import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSlider from 'vue-slider-component'
import VueDraggableResizable from 'vue-draggable-resizable'
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import 'vue-slider-component/theme/default.css'
import './styles/main.scss';
import 'vue-swatches/dist/vue-swatches.css'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import VueAnalytics from 'vue-analytics'

Vue.component('perfect-scrollbar', PerfectScrollbar)
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.component('VueSlider', VueSlider)
Vue.config.productionTip = false

Vue.use(VueAnalytics, {
  id: 'UA-97437577-5'
})

// Filters
import { registerFilters } from './filters';
registerFilters();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

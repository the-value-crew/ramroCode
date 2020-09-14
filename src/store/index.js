import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields';
import VuexPersistence from 'vuex-persist'
// import lzstring from "lz-string";

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  key: 'ramroCode-Config',
  storage: window.localStorage
});

let firstTimeConfig = {
  codeText: "// RamroCode(1.1.0) - Make your code look beautiful \n\n" +
    "var step1 = 'Copy and paste your code here'; \n\n" +
    "var step2 = 'Choose a template or customize it yourself'; \n\n" +
    "var step3 = 'Download/Copy image and use it on your blogs, videos, notes'; \n\n" +
    "var step4 = 'Tell your friends about this awesome tool 😃' \n\n" +
    "//Thank You",
  configVisible: true,
  selectedEditorTheme: "dracula",
  selectedBorderTheme: "theme-1",
  selectedStackTheme: "none",
  selectedLanguage: "javascript",
  fontSize: 16,
  fontFamily: '"Fira Code", monospace',
  paddingX: 50,
  paddingY: 50,
  borderRadius: 5,
  backgroundColor: "#2980b9",
  selectedTemplate: "temp-default",
  zoom: 1,
  shadow: false,
  showLanguageName: false,
  transform3d: {
    x: 0,
    y: 0,
    z: 0,
  },
  downloadLoading: false,
  downloadImageQuality: 0.9,
}
// check if url contains config
// if (window.location.hash.includes('?data=')) {
//   try {
//     let hashData = JSON.parse(decodeURIComponent(window.location.hash.slice(8)));
//     localStorage.removeItem('ramroCode-Config');
//     firstTimeConfig = hashData;
//     alert('success');
//   } catch (e) {
//     console.log(e);
//   }
// }

export default new Vuex.Store({
  state: {
    config: firstTimeConfig
  },

  getters: {
    getField,
  },
  mutations: {
    updateField,
  },
  plugins: [vuexLocal.plugin]
})



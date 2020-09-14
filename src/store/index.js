import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: {
      visible: true,
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
  },

  getters: {
    getField,
  },
  mutations: {
    updateField,
  }
})

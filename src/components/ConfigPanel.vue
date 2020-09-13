<template>
  <div class="cpanel" :class="{'--hidden': !config.visible}">
    <div class="shortcut">
      <div class="shortcutBtn --handle" @click="toggleConfig()">
        <i
          class="fal"
          :class="{'fa-angle-right': config.visible, 'fa-angle-left': !config.visible}"
        ></i>
      </div>

      <div class="shortcutBtn" @click="zoom(-1)">
        <i class="fal fa-search-minus"></i>
      </div>

      <div class="shortcutBtn">
        <span class="btnText">{{Math.floor(config.zoom * 100)}}%</span>
      </div>

      <div class="shortcutBtn" @click="zoom(1)">
        <i class="fal fa-search-plus"></i>
      </div>
    </div>

    <div class="generalSettings">
      <h1 class="title">Edit Panel</h1>

      <label>Language</label>
      <select class="form-control" @input="(e) => changeLanguage(e.target.value)">
        <option
          v-for="language in hljsLanguages"
          :key="language.value"
          :value="language.value"
          :selected="language.value == config.selectedLanguage"
        >{{language.label}}</option>
      </select>

      <label>Choose a template</label>
      <Templates :value="config.selectedTemplate" @input="handleTemplateChange" />
    </div>

    <div class="advancedSettings">
      <div class="header">Additonal settings</div>
      <div class="content">
        <div style="display: flex; flex-direction: column">
          <label>Editor Theme</label>
          <select class="form-control" @input="(e) => changeEditorTheme(e.target.value)">
            <option
              v-for="theme in hljsThemes"
              :value="theme.value"
              :selected="theme.value == config.selectedEditorTheme"
              :key="theme.value"
            >{{theme.label}}</option>
          </select>
        </div>

        <div class="row">
          <div class="col">
            <label>Border Theme</label>
            <select class="form-control" @input="(e) => changeBorderTheme(e.target.value)">
              <option
                v-for="borderTheme in borderThemes"
                :key="borderTheme.value"
                :value="borderTheme.value"
                :selected="borderTheme.value == config.selectedBorderTheme"
              >{{borderTheme.label}}</option>
            </select>
          </div>
          <div class="col">
            <label>Stack Theme</label>
            <select
              class="form-control"
              @input="(e) => changeStackTheme(e.target.value)"
              style="max-width: 120px"
            >
              <option
                v-for="theme in stackThemes"
                :value="theme.value"
                :selected="theme.value == config.selectedStackTheme"
                :key="theme.value"
              >{{theme.label}}</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <label>Font Size</label>
            <RangeInput
              v-model="config.fontSize"
              :min="10"
              :max="40"
              :value="config.fontSize"
              @input="propagateChange"
            />
          </div>
          <div class="col">
            <label>Font family</label>
            <select
              class="form-control"
              v-model="config.fontFamily"
              @input="propagateChange"
              style="max-width: 120px"
            >
              <option
                v-for="font in fontFamilies"
                :value="font.value"
                :selected="font.value == config.fontFamily"
                :key="font.value"
              >{{font.label}}</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <ColorPicker
              v-model="config.backgroundColor"
              @input="propagateChange"
              :value="config.backgroundColor"
            />
          </div>

          <div class="col">
            <label>Rounded Corners</label>
            <RangeInput
              v-model="config.borderRadius"
              :min="0"
              :max="30"
              :value="config.borderRadius"
              @input="propagateChange"
            />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <label>Horizontal gap</label>
            <RangeInput
              v-model="config.paddingX"
              :min="0"
              :max="100"
              :value="config.paddingX"
              @input="propagateChange"
            />
          </div>

          <div class="col">
            <label>Vertical gap</label>
            <RangeInput
              v-model="config.paddingY"
              :min="0"
              :max="100"
              :value="config.paddingY"
              @input="propagateChange"
            />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="checkboxWrapper">
              <input type="checkbox" id="showLanguageName" v-model="config.showLanguageName" />
              <label for="showLanguageName">Show language</label>
            </div>
          </div>
          <div class="col">
            <div class="checkboxWrapper">
              <input type="checkbox" id="shadow" v-model="config.shadow" />
              <label for="shadow">Shadow</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="actionBtnContainer">
      <button class="actionBtn" @click="handleDownload()">
        <i class="fal fa-download"></i>
        <span>Download Image</span>
      </button>
      <button class="actionBtn" @click="handleDownload()">
        <i class="fal fa-cloud-upload"></i>
        <span>Upload to cloud</span>
      </button>
    </div>
  </div>
</template>

<script>
import { hljsThemes } from "@/data";
import humanizeString from "humanize-string";
import RangeInput from "@/components/RangeInput";
import ColorPicker from "@/components/ColorPicker";
import Templates from "@/components/Templates";
import hljs from "highlight.js";

export default {
  name: "ConfigPanel",
  components: { ColorPicker, RangeInput, Templates },
  props: ["value"],
  data() {
    return {
      config: null,

      borderThemes: [
        { label: "None", value: "none" },
        { label: "Theme 1", value: "theme-1" },
        { label: "Theme 2", value: "theme-2" },
        { label: "Theme 3", value: "theme-3" },
        { label: "Theme 4", value: "theme-4" },
      ],

      stackThemes: [
        { label: "None", value: "none" },
        { label: "Scaterred", value: "theme-1" },
        { label: "Stacked", value: "theme-2" },
      ],

      fontFamilies: [
        { label: "Fira Code", value: '"Fira Code", monospace' },
        { label: "Source Code Pro", value: '"Source Code Pro", monospace' },
        { label: "Inconsolata", value: '"Inconsolata", monospace' },
        { label: "Ubuntu Mono", value: '"Ubuntu Mono", monospace' },
      ],
    };
  },

  created() {
    this.config = this.value;
    this.propagateChange();
  },

  methods: {
    zoom(type) {
      if (type === 1) this.config.zoom += 0.05;
      else this.config.zoom -= 0.05;
      this.propagateChange();
    },

    propagateChange() {
      this.$emit("input", this.config);
    },

    handleDownload() {
      this.$emit("download");
    },

    changeEditorTheme(themeFileName) {
      var head = document.getElementsByTagName("head")[0];
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "/hljs-themes/" + themeFileName + ".css";
      head.appendChild(link);
      this.$emit("editorThemeChange", themeFileName);
    },

    changeBorderTheme(themeName) {
      this.config.selectedBorderTheme = themeName;
      this.propagateChange();
    },

    changeStackTheme(themeName) {
      this.config.selectedStackTheme = themeName;
      this.$emit("stackThemeChange", themeName);
    },

    changeLanguage(languageName) {
      this.config.selectedLanguage = languageName;
      this.$emit("languageChange", languageName);
    },

    handleTemplateChange(template) {
      this.$emit("templateChange", template.name);
      Object.keys(template).forEach((key) => {
        this.config[key] = template[key];
      });
    },

    toggleConfig() {
      this.config.visible = !this.config.visible;
      this.propagateChange();
    },
  },

  computed: {
    hljsThemes() {
      return hljsThemes.map((filename) => {
        return {
          label: humanizeString(filename),
          value: filename,
        };
      });
    },

    hljsLanguages() {
      return hljs.listLanguages().map((language) => {
        return {
          label: humanizeString(language),
          value: language,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cpanel {
  width: 250px;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  background-color: #3f3b41;
  color: white;
  box-shadow: -5px 0px 5px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-in-out;
  user-select: none;

  &.--hidden {
    transform: translateX(100%);
  }

  .shortcut {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-35px, 10%);
    color: #3f3b41;
    display: flex;
    flex-direction: column;

    .shortcutBtn {
      position: relative;
      height: 30px;
      width: 30px;
      cursor: pointer;

      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: bold;
      }

      .btnText {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: bold;
        font-size: 0.8rem;
      }

      &.--handle {
        background-color: #3f3b41;
        border-radius: 5px;
        color: white;
        transform: translateX(10px);
        margin-bottom: 50px;
      }
    }
  }

  .title {
    text-align: center;
    font-size: 1.2rem;
  }

  .form-control {
    outline: none;
    color: black;
    padding: 0.25rem 0.5rem;
    border-radius: 0.2rem;
    background-color: white;
    margin-top: 0.15rem;
    margin-bottom: 1rem;
    width: 100%;
  }

  .checkboxWrapper {
    display: flex;
    label {
      user-select: none;
      align-self: center;
    }
  }

  label {
    font-size: 0.8rem;
  }

  .generalSettings {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
  }

  .advancedSettings {
    margin-top: 0.25rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: darken(#3f3b41, 5);

    .header {
      color: #3f3b41;
      background-color: white;
      padding: 0.5rem 0;
      text-align: center;
      font-size: 0.9rem;
      font-weight: bold;
    }

    .content {
      padding: 0.5rem;
    }
  }

  .actionBtnContainer {
    width: 100%;
    display: flex;
    // flex-grow: 1;

    .actionBtn {
      outline: none;
      border: 1px solid white;
      background-color: transparent;
      width: 50%;
      color: white;
      cursor: pointer;
      padding: 0.5rem;
      align-self: flex-end;
      display: flex;
      text-align: center;
      flex-direction: column;

      &:first-child {
        border-left: none;
        border-right: none;
      }

      &:last-child {
        border-right: none;
      }

      i {
        margin: 0 auto;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      span {
        text-align: center;
      }
    }
  }
}
</style>


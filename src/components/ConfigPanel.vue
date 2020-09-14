<template>
  <div class="cpanel" :class="{'--hidden': !config.visible}">
    <div class="shortcut">
      <div class="shortcutBtn --handle" @click="toggleConfig()">
        <i
          class="fal"
          :class="{'fa-angle-right': config.visible, 'fa-angle-left': !config.visible}"
        ></i>
      </div>

      <div class="topSection">
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

      <div class="bottomSection" v-if="!config.visible">
        <div class="shortcutBtn" @click="handleDownload('Copy')" title="Copy to clipboard">
          <i class="fal fa-copy"></i>
        </div>

        <div class="shortcutBtn" @click="handleDownload('Png')" title="Download image">
          <i class="fal fa-download"></i>
        </div>
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

    <div class="header">Additional settings</div>
    <perfect-scrollbar class="advancedSettings">
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
              :max="200"
              :value="config.paddingX"
              @input="propagateChange"
            />
          </div>

          <div class="col">
            <label>Vertical gap</label>
            <RangeInput
              v-model="config.paddingY"
              :min="0"
              :max="200"
              :value="config.paddingY"
              @input="propagateChange"
            />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="checkboxWrapper">
              <input type="checkbox" id="showLanguageName" v-model="config.showLanguageName" />
              <label for="showLanguageName">Show Language</label>
            </div>
          </div>
          <div class="col">
            <div class="checkboxWrapper">
              <input type="checkbox" id="shadow" v-model="config.shadow" />
              <label for="shadow">Enable Shadow</label>
            </div>
          </div>
        </div>

        <div>
          <label>3D Transformation</label>
          <RangeInput
            v-model="config.transform3d.x"
            :value="config.transform3d"
            :min="-360"
            :max="360"
            dotLabel="X: "
            dotWidth="26"
            @input="propagateChange"
          />
          <RangeInput
            v-model="config.transform3d.y"
            :value="config.transform3d"
            :min="-360"
            :max="360"
            dotLabel="Y: "
            dotWidth="26"
            @input="propagateChange"
          />
          <RangeInput
            v-model="config.transform3d.z"
            :value="config.transform3d"
            :min="-360"
            :max="360"
            dotLabel="Z: "
            dotWidth="26"
            @input="propagateChange"
          />
        </div>
      </div>
    </perfect-scrollbar>

    <div class="actionBtnContainer">
      <div class="loading" v-if="config.downloadLoading">
        <i class="fal fa-spinner fa-spin"></i>
      </div>

      <div class="topSection">
        <div class="actionBtn" @click="handleDownload('Png')">
          <i class="fal fa-download"></i>
          <span>PNG</span>
        </div>

        <div class="actionBtn" @click="handleDownload('Svg')">
          <i class="fal fa-download"></i>
          <span>SVG</span>
        </div>

        <div class="actionBtn" @click="handleDownload('Copy')">
          <i class="fal fa-copy"></i>
          <span>Copy to clipboard</span>
        </div>
      </div>

      <div class="bottomSection">
        <div class="actionBtn" @click="handleDownload('Jpeg')">
          <i class="fal fa-download"></i>
          <span>JPEG</span>
        </div>
        <div class="imageQuality">
          with
          <select v-model="config.downloadImageQuality">
            <option
              v-for="i in 10"
              :key="i"
              :value="i/10"
              :selected="config.downloadImageQuality === i/10"
            >{{i * 10}}%</option>
          </select>
          Quality
        </div>
      </div>
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

    handleDownload(type) {
      this.$emit("download", type);
      // console.log(type);
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
  width: 275px;
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
    height: 100%;
    transform: translateX(-35px);
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
        // font-weight: bold;
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
        margin-top: 20px;
      }
    }

    .bottomSection {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: 1rem;
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
    margin-bottom: 1rem;
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
    padding-bottom: 0;
  }

  .header {
    color: white;
    background-color: darken($color: #3f3b41, $amount: 10);
    padding: 0.5rem 0;
    text-align: center;
    font-size: 0.9rem;
    // font-weight: bold;
  }

  .advancedSettings {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: darken(#3f3b41, 5);

    .content {
      padding: 0.75rem;
    }
  }

  .actionBtnContainer {
    position: relative;
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;

    .actionBtn {
      font-size: 0.8rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      display: flex;
      border-radius: 3px;

      i {
        align-self: center;
        margin-right: 5px;
      }

      span {
        align-self: center;
      }

      select {
        margin: 0 0.25rem;
      }

      &:hover {
        background-color: darken($color: #3f3b41, $amount: 2);
      }
    }

    .topSection {
      display: flex;
      justify-content: space-between;
    }

    .bottomSection {
      display: flex;

      .imageQuality {
        margin-left: 5px;
        font-size: 0.8rem;
      }
    }

    .loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: darken($color: #3f3b41, $amount: 10);
      opacity: 0.9;
      display: flex;
      justify-content: center;

      i {
        font-size: 2rem;
        align-self: center;
        color: white;
      }
    }
  }
}
</style>


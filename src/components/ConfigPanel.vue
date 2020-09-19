<template>
  <div class="cpanel" :class="{ '--hidden': !configVisible }">
    <div class="shortcut">
      <div class="shortcutBtn --handle" @click="toggleConfig()">
        <i
          class="fal"
          :class="{
            'fa-angle-right': configVisible,
            'fa-angle-left': !configVisible,
          }"
        ></i>
      </div>

      <div class="topSection">
        <div class="shortcutBtn" @click="zoomEditor(-1)">
          <i class="fal fa-search-minus"></i>
        </div>

        <div class="shortcutBtn">
          <span class="btnText">{{ Math.floor(zoom * 100) }}%</span>
        </div>

        <div class="shortcutBtn" @click="zoomEditor(1)">
          <i class="fal fa-search-plus"></i>
        </div>
      </div>

      <div class="bottomSection" v-if="!configVisible">
        <div
          class="shortcutBtn"
          @click="handleDownload('Copy')"
          title="Copy to clipboard"
        >
          <i class="fal fa-copy"></i>
        </div>

        <div
          class="shortcutBtn"
          @click="handleDownload('Png')"
          title="Download image"
        >
          <i class="fal fa-download"></i>
        </div>
      </div>
    </div>

    <div class="generalSettings">
      <h1 class="title">Edit Panel</h1>

      <label>Language</label>
      <select class="form-control" v-model="selectedLanguage">
        <option
          v-for="(language, i) in codemirrorLanguages"
          :key="i"
          :value="language.value"
          :selected="language.value == selectedLanguage"
        >
          {{ language.label }}
        </option>
      </select>

      <label>Choose a template</label>
      <Templates
        :value="selectedTemplate"
        @input="(tempName) => (selectedTemplate = tempName)"
      />
    </div>

    <div class="header">Additional settings</div>
    <perfect-scrollbar class="advancedSettings">
      <div class="content">
        <div style="display: flex; flex-direction: column">
          <label>Editor Theme</label>
          <select class="form-control" v-model="selectedEditorTheme">
            <option
              v-for="theme in codeMirrorThemes"
              :value="theme.value"
              :selected="theme.value == selectedEditorTheme"
              :key="theme.value"
            >
              {{ theme.label }}
            </option>
          </select>
        </div>

        <div class="row">
          <div class="col">
            <label>Border Theme</label>
            <select class="form-control" v-model="selectedBorderTheme">
              <option
                v-for="borderTheme in borderThemes"
                :key="borderTheme.value"
                :value="borderTheme.value"
                :selected="borderTheme.value == selectedBorderTheme"
              >
                {{ borderTheme.label }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Stack Theme</label>
            <select
              class="form-control"
              v-model="selectedStackTheme"
              style="max-width: 120px"
            >
              <option
                v-for="theme in stackThemes"
                :value="theme.value"
                :selected="theme.value == selectedStackTheme"
                :key="theme.value"
              >
                {{ theme.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <label>Font Size</label>
            <RangeInput
              v-model="fontSize"
              :min="10"
              :max="40"
              :value="fontSize"
            />
          </div>
          <div class="col">
            <label>Font family</label>
            <select
              class="form-control"
              v-model="fontFamily"
              style="max-width: 120px"
            >
              <option
                v-for="font in fontFamilies"
                :value="font.value"
                :selected="font.value == fontFamily"
                :key="font.value"
              >
                {{ font.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <ColorPicker v-model="backgroundColor" :value="backgroundColor" />
          </div>

          <div class="col">
            <label>Rounded Corners</label>
            <RangeInput
              v-model="borderRadiusInner"
              :min="0"
              :max="30"
              :value="borderRadiusInner"
              dotLabel="In: "
            />
            <RangeInput
              v-model="borderRadiusOuter"
              :min="0"
              :max="30"
              :value="borderRadiusOuter"
              dotLabel="Out: "
            />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <label>Horizontal gap</label>
            <RangeInput
              v-model="paddingX"
              :min="0"
              :max="200"
              :value="paddingX"
            />
          </div>

          <div class="col">
            <label>Vertical gap</label>
            <RangeInput
              v-model="paddingY"
              :min="0"
              :max="200"
              :value="paddingY"
            />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="checkboxWrapper">
              <input
                type="checkbox"
                id="showLanguageName"
                v-model="showLanguageName"
              />
              <label for="showLanguageName">Language</label>
            </div>
          </div>
          <div class="col">
            <div class="checkboxWrapper">
              <input type="checkbox" id="lineNumbers" v-model="lineNumbers" />
              <label for="lineNumbers">Line Numbers</label>
            </div>
          </div>
        </div>

        <div>
          <div class="checkboxWrapper">
            <input type="checkbox" id="shadow" v-model="shadowVisibility" />
            <label for="shadow">Enable Shadow</label>
          </div>

          <div class="shadowControls" v-if="shadowVisibility">
            <RangeInput
              v-model="shadowHorizontalLength"
              :min="-30"
              :max="30"
              :value="shadowHorizontalLength"
              dotLabel="Width: "
            />
            <RangeInput
              v-model="shadowVerticalLength"
              :min="-30"
              :max="30"
              :value="shadowVerticalLength"
              dotLabel="Height: "
            />

            <RangeInput
              v-model="shadowBlur"
              :min="0"
              :max="30"
              :value="shadowBlur"
              dotLabel="Blur: "
            />

            <RangeInput
              v-model="shadowSpread"
              :min="0"
              :max="30"
              :value="shadowSpread"
              dotLabel="Spread: "
            />

            <NativeColorPicker v-model="shadowColor" :value="shadowColor" />
          </div>
        </div>

        <div>
          <div class="labelWithControl">
            <label>3D Transformation</label>
            <button class="btnConfig" @click="reset3dTransform()">Reset</button>
          </div>
          <RangeInput
            v-model="x"
            :value="x"
            :min="-360"
            :max="360"
            dotLabel="X: "
            dotWidth="26"
          />
          <RangeInput
            v-model="y"
            :value="y"
            :min="-360"
            :max="360"
            dotLabel="Y: "
            dotWidth="26"
          />
          <RangeInput
            v-model="z"
            :value="z"
            :min="-360"
            :max="360"
            dotLabel="Z: "
            dotWidth="26"
          />
        </div>
      </div>
    </perfect-scrollbar>

    <div class="actionBtnContainer">
      <div class="loading" v-if="downloadLoading">
        <i class="fal fa-spinner fa-spin"></i>
      </div>

      <div class="topSection">
        <div class="imageScaling">
          Scale
          <select v-model="downloadImageScaling">
            <option
              v-for="i in 5"
              :key="i"
              :value="i"
              :selected="downloadImageScaling === i"
            >
              {{ i }}x
            </option>
          </select>
        </div>

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
          <span>Copy</span>
        </div>

        <!-- <div class="actionBtn" @click="handleDownload('Config')">
          <i class="fal fa-copy"></i>
          <span>Url</span>
        </div>-->
      </div>

      <div class="bottomSection">
        <div class="actionBtn" @click="handleDownload('Jpeg')">
          <i class="fal fa-download"></i>
          <span>JPEG</span>
        </div>
        <div class="imageQuality">
          with
          <select v-model="downloadImageQuality">
            <option
              v-for="i in 10"
              :key="i"
              :value="i / 10"
              :selected="downloadImageQuality === i / 10"
            >
              {{ i * 10 }}%
            </option>
          </select>
          Quality
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { codeMirrorThemes, codemirrorModes } from "@/data";
import humanizeString from "humanize-string";
import RangeInput from "@/components/RangeInput";
import ColorPicker from "@/components/ColorPicker";
import NativeColorPicker from "@/components/NativeColorPicker";
import Templates from "@/components/Templates";
import { templates } from "@/data";
import { mapFields } from "vuex-map-fields";
import { domToImage } from "@/helpers/dom-to-image";

export default {
  name: "ConfigPanel",
  components: { ColorPicker, RangeInput, Templates, NativeColorPicker },
  data() {
    return {
      borderThemes: [
        { label: "None", value: "none" },
        { label: "Theme 1", value: "theme-1" },
        { label: "Theme 2", value: "theme-2" },
        { label: "Theme 3", value: "theme-3" },
        { label: "Theme 4", value: "theme-4" },
        { label: "Theme 5", value: "theme-5" },
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
    // console.log(JSON.stringify(this.codemirrorLanguages));
  },

  methods: {
    zoomEditor(type) {
      if (type === 1) this.zoom += 0.05;
      else this.zoom -= 0.05;
    },

    reset3dTransform() {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    },

    async handleDownload(type) {
      if (!this.downloadLoading) {
        this.downloadLoading = true;
        try {
          await domToImage(
            type,
            document.querySelector("#screenshot"),
            this.downloadImageQuality,
            this.downloadImageScaling
          );
        } catch (error) {
          alert(error);
        }
        this.downloadLoading = false;
      }
    },

    toggleConfig() {
      this.configVisible = !this.configVisible;
    },
  },

  computed: {
    ...mapFields([
      "config.configVisible",
      "config.selectedTemplate",
      "config.selectedEditorTheme",
      "config.selectedBorderTheme",
      "config.selectedStackTheme",
      "config.selectedLanguage",
      "config.fontSize",
      "config.fontFamily",
      "config.paddingX",
      "config.paddingY",
      "config.borderRadiusInner",
      "config.borderRadiusOuter",
      "config.backgroundColor",
      "config.zoom",
      "config.showLanguageName",
      "config.transform3d.x",
      "config.transform3d.y",
      "config.transform3d.z",
      "config.downloadLoading",
      "config.downloadImageQuality",
      "config.downloadImageScaling",
      "config.lineNumbers",
    ]),

    ...mapFields({
      shadowVisibility: "config.shadow.visible",
      shadowHorizontalLength: "config.shadow.horizontal",
      shadowVerticalLength: "config.shadow.vertical",
      shadowBlur: "config.shadow.blur",
      shadowSpread: "config.shadow.spread",
      shadowColor: "config.shadow.color",
    }),

    codeMirrorThemes() {
      return codeMirrorThemes.map((filename) => {
        return {
          label: humanizeString(filename),
          value: filename,
        };
      });
    },

    codemirrorLanguages() {
      return codemirrorModes;
    },
  },

  watch: {
    selectedTemplate: {
      immediate: true,
      handler: function (newVal) {
        let template = templates.find((t) => t.name === newVal);

        // flatten template data
        template.x = template.transform3d.x;
        template.y = template.transform3d.y;
        template.z = template.transform3d.z;
        Object.keys(template).forEach((key) => (this[key] = template[key]));
      },
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

  .btnConfig {
    border: 1px solid darken($color: #3f3b41, $amount: 10);
    background-color: darken($color: #3f3b41, $amount: 10);
    color: white;
    cursor: pointer;
    border-radius: 5px;
    padding: 0.15rem 0.5rem;
    font-size: 0.8rem;
    outline: none;

    &:active {
      border-color: #3f3b41;
    }
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

      .imageScaling {
        font-size: 0.8rem;
      }
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

  .labelWithControl {
    display: flex;
    justify-content: space-between;
    label {
      align-self: center;
    }
  }
}
</style>

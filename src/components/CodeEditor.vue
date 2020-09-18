<template>
  <div ref="codeMirrorWrapper" class="CodeMirrorWrapper" :style="wrapperStyle">
    <div id="border" :class="'--' + selectedBorderTheme">
      <div class="dots">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>
      <div class="languageName" v-if="showLanguageName">{{selectedLanguage | humanize}}</div>
    </div>
    <textarea ref="codemirror"></textarea>
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import { mapFields } from "vuex-map-fields";
import "codemirror/lib/codemirror.css";
import "codemirror/keymap/sublime.js";

export default {
  name: "CodeEditor",
  components: {},
  data() {
    return {
      codemirror: null,
      cmElem: null,
      themeBackgroundColor: null,
      themeTextColor: null,
      cmOption: {
        value: this.codeText,
        tabSize: 4,
        // lineNumbers: true,
        keyMap: "sublime",
        mode: this.selectedLanguage,
        theme: "base16-dark",
        viewportMargin: Infinity,
        lineWrapping: true,
        lint: false,
        spellcheck: false,
      },
    };
  },

  mounted() {
    console.log(this.codeText);
    this.codemirror = CodeMirror.fromTextArea(
      this.$refs.codemirror,
      this.cmOption
    );
    this.cmElem = this.codemirror.getWrapperElement();

    this.codemirror.on("viewportChange", this.handleViewPortChange);
    this.codemirror.on("change", () => {
      this.codeText = this.codemirror.getValue();
    });

    // set value at last so that it triggers above events
    this.codemirror.setValue(this.codeText);

    setInterval(() => {
      console.log(this.z);
    }, 1000);
  },

  methods: {
    handleViewPortChange() {
      let wrapperElem = this.$refs.codeMirrorWrapper;
      if (wrapperElem) {
        this.screenshotHeight = wrapperElem.offsetHeight + 2 * this.paddingY;
        this.refresh();
      }
    },

    refresh() {
      this.codemirror.refresh();
    },
  },

  computed: {
    ...mapFields([
      "config.codeText",
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
      "config.shadow",
      "config.showLanguageName",
      "config.transform3d.x",
      "config.transform3d.y",
      "config.transform3d.z",
      "config.screenshotWidth",
      "config.screenshotHeight",
      "config.lineNumbers",
    ]),

    wrapperStyle() {
      let extraCss = "";
      if (this.shadow)
        extraCss += `box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3),0 15px 12px rgba(0, 0, 0, 0.22);`;
      return `
        background-color: ${this.themeBackgroundColor};
        color: ${this.themeTextColor};
        font-size: ${this.fontSize}px;
        font-family: ${this.fontFamily} !important;
        border-radius: ${this.borderRadiusInner}px;
        transform: scale(${this.zoom}) rotateX(${this.x}deg) rotateY(${this.y}deg) rotateZ(${this.z}deg);
        ${extraCss}
      `;
    },
  },

  watch: {
    selectedLanguage: {
      immediate: true,
      async handler() {
        await import(
          `codemirror/mode/${this.selectedLanguage}/${this.selectedLanguage}.js`
        );
        this.codemirror.setOption("mode", this.selectedLanguage);
      },
    },

    lineNumbers: {
      immediate: true,
      async handler() {
        if (this.codemirror)
          this.codemirror.setOption("lineNumbers", this.lineNumbers);
      },
    },

    paddingY: {
      immediate: true,
      handler() {
        this.handleViewPortChange();
      },
    },

    paddingX: {
      immediate: true,
      handler() {
        this.handleViewPortChange();
      },
    },

    selectedEditorTheme: {
      immediate: true,
      async handler(newThemeName) {
        if (newThemeName) {
          await import(`codemirror/theme/${newThemeName}.css`);
          this.codemirror.setOption("theme", newThemeName);

          this.themeBackgroundColor = window
            .getComputedStyle(document.querySelector(".CodeMirror"))
            .getPropertyValue("background-color");
          this.themeTextColor = window
            .getComputedStyle(document.querySelector(".CodeMirror"))
            .getPropertyValue("color");
        }

        // setTimeout(() => {
        //   let themeColor = window
        //     .getComputedStyle(document.querySelector(".hljs"))
        //     .getPropertyValue("background-color");

        //   this.$refs.stackOne.style.backgroundColor = fluctuateRgb(
        //     themeColor,
        //     20
        //   );
        //   this.$refs.stackTwo.style.backgroundColor = fluctuateRgb(
        //     themeColor,
        //     10
        //   );
        // }, 1000);
      },
    },

    fontSize: {
      immediate: true,
      handler(newFontSize) {
        if (this.codemirror) {
          this.cmElem.style["font-size"] = newFontSize + "px";
          this.codemirror.refresh();
        }
      },
    },

    fontFamily: {
      immediate: true,
      handler(newFontFamily) {
        console.log(newFontFamily);
        if (this.codemirror) {
          this.cmElem.style["font-family"] = newFontFamily;
          this.codemirror.refresh();
        }
      },
    },
  },
};
</script>

<style lang="scss">
.CodeMirrorWrapper {
  border-radius: 5px;
  padding: 0.5rem;
  // height: calc(100% - 20px); //20x is border height
  .CodeMirror {
    height: auto; // grow height according to content
    font-family: inherit;
  }

  #border {
    margin: 0;
    padding: 0;
    height: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    transition: all 0.2s ease;
    $dotSize: 16px;

    .dots {
      display: flex;
      align-self: center;
      .dot {
        height: $dotSize;
        width: $dotSize;
        background-color: white;
        border-radius: 50%;
        align-self: center;
        margin: 0 5px;
      }
    }

    .languageName {
      align-self: center;
      font-size: 0.9rem;
      margin-right: 1rem;
    }

    &.--none {
      display: none;
    }

    &.--theme-1 {
      .dot-1 {
        background-color: #ff5f56;
      }
      .dot-2 {
        background-color: #ffbd2e;
      }
      .dot-3 {
        background-color: #27c93f;
      }
    }

    &.--theme-2 {
      .dot-1,
      .dot-2,
      .dot-3 {
        background-color: #3f3b41;
      }
    }

    &.--theme-3 {
      .dot-1,
      .dot-2,
      .dot-3 {
        background-color: #fefefe;
      }
    }

    &.--theme-4 {
      .dot-1,
      .dot-2,
      .dot-3 {
        height: $dotSize - 2;
        width: $dotSize - 2;
        background-color: transparent;
        border: 1px solid #fefefe;
      }
    }
  }
}
</style>


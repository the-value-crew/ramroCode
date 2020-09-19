<template>
  <div ref="codeMirrorWrapper" class="CodeMirrorWrapper" :style="wrapperStyle">
    <div id="border" :class="'--' + selectedBorderTheme">
      <div class="dots">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>
      <div class="languageName" v-if="showLanguageName">
        {{ selectedLanguage | humanize }}
      </div>
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
        tabSize: 4,
        keyMap: "sublime",
        viewportMargin: Infinity,
        scrollbarStyle: null,
        // lineWrapping: true,
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
  },

  methods: {
    fireEvent() {
      // CodeMirror.signal(this.$refs.codemirror, "viewportChange");
      this.codemirror.setValue(this.codeText);
    },

    handleViewPortChange() {
      let wrapperElem = this.$refs.codeMirrorWrapper;
      if (wrapperElem) {
        // this.screenshotHeight = wrapperElem.offsetHeight + 2 * this.paddingY;
        this.screenshotHeight =
          wrapperElem.getBoundingClientRect().height + 2 * this.paddingY;
        this.refresh();
      }
    },

    refresh() {
      if (this.codemirror) this.codemirror.refresh();
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
      "config.transform3d",
      "config.transform3d.x",
      "config.transform3d.y",
      "config.transform3d.z",
      "config.screenshotWidth",
      "config.screenshotHeight",
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

    wrapperStyle() {
      let extraCss = "";
      if (this.shadowVisibility)
        extraCss += `box-shadow: ${this.shadowHorizontalLength}px ${this.shadowVerticalLength}px ${this.shadowBlur}px ${this.shadowSpread}px ${this.shadowColor}`;
      return `
        background-color: ${this.themeBackgroundColor};
        color: ${this.themeTextColor};
        font-size: ${this.fontSize}px;
        font-family: ${this.fontFamily} !important;
        border-radius: ${this.borderRadiusInner}px;
        transform: rotateX(${this.x}deg) rotateY(${this.y}deg) rotateZ(${this.z}deg);
        ${extraCss}
      `;
    },
  },

  watch: {
    transform3d: {
      immediate: true,
      deep: true,
      handler() {
        this.refresh();
        // console.log("refresh--3d transform");
        // this.codemirror.refresh();
      },
    },

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
        //   this.$refs.stackOne.style.backgroundColor = fluctuateRgb(
        //     themeColor,
        //     20
        //   );
        //   this.$refs.stackTwo.style.backgroundColor = fluctuateRgb(
        //     themeColor,
        //     10
        //   );
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
  // overflow: hidden;
  .CodeMirror {
    height: auto; // grow height according to content
    font-family: inherit;
    overflow: hidden !important;
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

    // border themes
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

    &.--theme-5 {
      .dot-1,
      .dot-2 {
        background-color: white;
        filter: grayscale(80%);
      }
      .dot-3 {
        background-color: #ffbd2e;
      }
    }
  }
}
</style>

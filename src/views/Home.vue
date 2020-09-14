<template>
  <perfect-scrollbar class="home">
    <div class="logo">
      <img src="@/assets/logo.svg" />
      <span class="appName">
        RamroCode
        <span class="version">1.1.0</span>
      </span>
    </div>

    <div class="credit">
      Made with
      <span class="heart">❤</span>
      at
      <a
        href="https://github.com/the-value-crew"
        target="_blank"
        rel="noopener noreferrer"
      >TVC-labs</a>
    </div>

    <div class="codePanel" :style="codePanelCss">
      <vue-draggable-resizable
        :w="800"
        :h="400"
        :x="codePanelPos.x"
        :y="codePanelPos.y"
        :min-width="200"
        :min-height="200"
        class-name="resizeRect"
        class-name-handle="resizeHandle"
      >
        <div id="screenshot" :style="screenshotInlineCss">
          <pre id="code" :style="codeInlineCss"><div class="stack --first" :class="'--' + selectedStackTheme" ref="stackOne"></div><div
  class="stack --second"
  :class="'--' + selectedStackTheme"
  ref="stackTwo"
></div><div
  id="border"
  class="hljs"
  :class="'--' + selectedBorderTheme"
  :style="borderInlineCss"
><div class="dots">
          <div class="dot dot-1"></div>
          <div class="dot dot-2"></div>
          <div class="dot dot-3"></div>
</div>
          <div
  v-if="showLanguageName"
  class="languageName"
  contenteditable
  spellcheck="false"
>{{selectedLanguage | humanize}}</div>
        </div><div
  ref="codeEditor"
  id="codeEditor"
  class="hljs code"
  v-html="codeHighlighted"
  contenteditable
  spellcheck="false"
  @paste="(e) => handleCodeEditorPaste(e)"
  @input="handleCodeEditorChange"
  :style="codeEditorInlineCss"
></div></pre>
        </div>
      </vue-draggable-resizable>
    </div>

    <ConfigPanel
      ref="configPanel"
      @download="handleDownload"
      @languageChange="reHighlight"
      @templateChange="reHighlight"
      @editorThemeChange="reHighlight"
    />
  </perfect-scrollbar>
</template>

<script>
import ConfigPanel from "@/components/ConfigPanel";
import { fluctuateRgb } from "@/helpers/core";
import { domToImage } from "@/helpers/dom-to-image";
import { templates } from "@/data";
import { mapFields } from "vuex-map-fields";
import { highlight } from "@/workers/hljs.worker";

export default {
  name: "Home",
  components: { ConfigPanel },
  data() {
    return {
      codeHighlighted: null,
      stackBaseColor: null,
    };
  },

  mounted() {
    this.reHighlight();
  },

  methods: {
    async handleDownload(type) {
      if (!this.downloadLoading) {
        this.downloadLoading = true;
        try {
          await domToImage(type, document.querySelector("#screenshot"));
        } catch (error) {
          alert(error);
        }
        this.downloadLoading = false;
      }
    },

    async handleCodeEditorPaste(e) {
      e.preventDefault();
      this.codeText = e.clipboardData.getData("text");
      document.execCommand("inserttext", false, this.codeText);
      let hlData = await highlight(this.codeText);
      this.selectedLanguage = hlData.language;
      this.codeHighlighted = hlData.value;
    },

    handleCodeEditorChange(e) {
      this.codeText = e.target.innerText;
    },

    async reHighlight() {
      let highlightData = await highlight(this.codeText, this.selectedLanguage);
      if (highlightData) this.codeHighlighted = highlightData.value;
    },
  },

  computed: {
    ...mapFields([
      "config.configVisible",
      "config.codeText",
      "config.selectedTemplate",
      "config.selectedEditorTheme",
      "config.selectedBorderTheme",
      "config.selectedStackTheme",
      "config.selectedLanguage",
      "config.fontSize",
      "config.fontFamily",
      "config.paddingX",
      "config.paddingY",
      "config.borderRadius",
      "config.backgroundColor",
      "config.zoom",
      "config.shadow",
      "config.showLanguageName",
      "config.transform3d.x",
      "config.transform3d.y",
      "config.transform3d.z",
      "config.downloadLoading",
      "config.downloadImageQuality",
    ]),

    codePanelPos() {
      let pos = {
        x: window.innerWidth / 2 - 400 - 250 / 2,
        y: window.innerHeight / 2 - 200,
      };
      if (pos.x <= 0) pos.x = 100;
      return pos;
    },

    codePanelCss() {
      return `transform: scale(${this.zoom})`;
    },

    codeInlineCss() {
      return `transform: rotateX(${this.x}deg) rotateY(${this.y}deg) rotateZ(${this.z}deg);`;
    },

    codeEditorInlineCss() {
      let extraCss = "";
      if (this.selectedBorderTheme === "none")
        extraCss = `
        border-top-left-radius: ${this.borderRadius}px;
        border-top-right-radius: ${this.borderRadius}px;
      `;
      if (this.shadow)
        extraCss += `box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3),0 15px 12px rgba(0, 0, 0, 0.22);`;
      return `
        font-size: ${this.fontSize}px;
        font-family: ${this.fontFamily} !important;
        border-bottom-left-radius: ${this.borderRadius}px;
        border-bottom-right-radius: ${this.borderRadius}px;
        ${extraCss}
      `;
    },

    borderInlineCss() {
      return `
        border-top-left-radius: ${this.borderRadius}px; 
        border-top-right-radius: ${this.borderRadius}px;
      `;
    },

    screenshotInlineCss() {
      return `
        border-radius: ${this.borderRadius}px;
        background-color: ${this.backgroundColor};
        padding: ${this.paddingY || 0}px ${this.paddingX || 0}px;
      `;
    },
  },

  watch: {
    selectedEditorTheme: {
      immediate: true,
      handler: function (newThemeName) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "/hljs-themes/" + newThemeName + ".css";
        head.appendChild(link);

        setTimeout(() => {
          let themeColor = window
            .getComputedStyle(document.querySelector(".hljs"))
            .getPropertyValue("background-color");

          this.$refs.stackOne.style.backgroundColor = fluctuateRgb(
            themeColor,
            20
          );
          this.$refs.stackTwo.style.backgroundColor = fluctuateRgb(
            themeColor,
            10
          );
        }, 1000);
      },
    },
    selectedLanguage: {
      immediate: true,
      handler() {
        this.reHighlight();
      },
    },

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

<style lang="scss">
.resizeHandle {
  position: absolute;
  background-color: white;
  border: 3px solid #3f3b41;
  border-radius: 50%;
  height: 14px;
  width: 14px;
  box-sizing: border-box;
  z-index: 1000;

  &-tl {
    transform: translate(-50%, -50%);
    cursor: nw-resize;
  }

  &-tm {
    left: 50%;
    transform: translate(-50%, -70%);
    cursor: n-resize;
  }

  &-tr {
    right: 0;
    transform: translate(50%, -50%);
    cursor: ne-resize;
  }

  &-ml {
    top: 50%;
    left: 0;
    transform: translate(-70%, -50%);
    cursor: w-resize;
  }

  &-mr {
    top: 50%;
    right: 0;
    transform: translate(70%, -50%);
    cursor: e-resize;
  }

  &-bl {
    top: 100%;
    bottom: 0;
    transform: translate(-50%, -50%);
    cursor: sw-resize;
  }

  &-bm {
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 70%);
    cursor: s-resize;
  }

  &-br {
    right: 0;
    bottom: 0;
    transform: translate(50%, 50%);
    cursor: se-resize;
  }
}

.resizeRect {
  border: 3px dashed #3f3b41;
  z-index: 1000;
}

.home {
  position: relative;
  width: 100%;
  height: 100%;

  .logo {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
    display: flex;

    img {
      align-self: center;
      height: 36px;
      width: auto;
      margin-right: 0.25rem;
    }

    .appName {
      color: #3f3b41;
      font-size: 1rem;
      align-self: center;

      .version {
        font-size: 0.7rem;
      }
    }
  }

  .credit {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    color: #3f3b41;
    font-size: 0.8rem;
    z-index: 1000;

    .heart {
      color: #d32f2f;
    }

    a {
      color: #3f3b41;
    }
  }

  .codePanel {
    position: relative;
    width: 100%;
    height: 100%;
    transition: all 0.2s ease;
    #screenshot {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      transition: background-color 0.2s ease;
      #code {
        $borderHeight: 40px;

        width: 100%;
        height: 100%;
        margin-bottom: 0;
        margin-top: 0;
        position: relative;
        z-index: 1;

        .blob {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          z-index: -1;
        }

        .stack {
          position: absolute;
          top: 0px;
          left: 0px;
          border-radius: 5px;
          width: 100%;
          height: 100%;
          padding: unset;
          transform-origin: 50% 50%;
          z-index: -1;

          &.--theme-1 {
            &.--first {
              top: -15px;
              left: -15px;
              transform: rotate(-4.72deg);
            }

            &.--second {
              top: 10px;
              left: 10px;
              transform: rotate(4.72deg);
            }
          }

          &.--theme-2 {
            &.--first {
              top: unset;
              width: 90%;
              bottom: -13px;
              left: 50%;
              transform: translateX(-50%);
              z-index: -2;
            }

            &.--second {
              top: unset;
              width: 96%;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              z-index: -1;
            }
          }

          &.--none {
            display: none;
          }
        }

        #border {
          height: $borderHeight;
          margin: 0;
          padding: 0;
          padding-left: 0.5rem;
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

        #codeEditor {
          height: calc(100% - #{$borderHeight});
          box-sizing: border-box;
          padding: 1.5rem 1rem;
          outline: none;
          white-space: break-spaces;
          overflow: hidden;
          transition: all 0.2s ease;

          //   background-size: 30px 30px;
          //   background-image: radial-gradient(
          //     circle,
          //     white 1px,
          //     rgba(0, 0, 0, 0) 1px
          //   );
        }

        // box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3),
        //   0 15px 12px rgba(0, 0, 0, 0.22);
      }
    }
  }
}
</style>
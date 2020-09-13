<template>
  <perfect-scrollbar class="home">
    <div class="logo">
      <img src="@/assets/logo.svg" />
      <span class="appName">RamroCode <span class="version">1.1.0</span> </span>
    </div>

    <div class="credit">
      Made with
      <span class="heart">❤</span>
      by
      <a
        href="https://github.com/bibhuticoder"
        target="_blank"
        rel="noopener noreferrer"
      >bibhuti</a>
    </div>

    <div class="codePanel" :style="codePanelCss">
      <vue-draggable-resizable
        :w="500"
        :h="400"
        :x="codePanelPos.x"
        :y="codePanelPos.y"
        :min-width="200"
        :min-height="200"
        class-name="resizeRect"
        class-name-handle="resizeHandle"
      >
        <div id="screenshot" :style="screenshotInlineCss">
          <pre id="code"><div class="stack --first" :class="'--' + config.selectedStackTheme" ref="stackOne"></div><div
  class="stack --second"
  :class="'--' + config.selectedStackTheme"
  ref="stackTwo"
></div><div
  id="border"
  class="hljs"
  :class="'--' + config.selectedBorderTheme"
  :style="borderInlineCss"
>
          <div class="dot dot-1"></div>
          <div class="dot dot-2"></div>
          <div class="dot dot-3"></div>
        </div><perfect-scrollbar
  :options="{useBothWheelAxes: true}"
  ref="codeEditor"
  id="codeEditor"
  class="hljs code"
  v-html="codeHighlighted"
  contenteditable
  spellcheck="false"
  @paste="(e) => handleCodeEditorPaste(e)"
  @input="handleCodeEditorChange"
  :style="codeEditorInlineCss"
></perfect-scrollbar></pre>
        </div>
      </vue-draggable-resizable>
    </div>

    <ConfigPanel
      ref="configPanel"
      v-model="config"
      :value="config"
      @download="toCanvas()"
      @languageChange="handleLanguageChange"
      @templateChange="handleTemplateChange"
      @editorThemeChange="handleEditorThemeChange"
      @stackThemeChange="handleStackThemeChange"
    />
  </perfect-scrollbar>
</template>

<script>
// import html2canvas from "html2canvas";
import hljs from "highlight.js";
import { saveAs } from "file-saver";
import ConfigPanel from "@/components/ConfigPanel";
import { templates } from "@/data";
import { fluctuateRgb } from "@/helper";
import domtoimage from "dom-to-image";
// import prettier from "prettier";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";

export default {
  name: "Home",
  components: { ConfigPanel, PerfectScrollbar },
  data() {
    return {
      codeText: null,
      codeHighlighted: null,
      stackBaseColor: null,

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
      },
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    toCanvas() {
      // html2canvas(document.querySelector("#screenshot")).then((canvas) => {
      //   canvas.toBlob(function (blob) {
      //     saveAs(blob, "prettycodes.png");
      //   });
      // });

      domtoimage.toBlob(document.querySelector("#screenshot")).then((blob) => {
        saveAs(blob, "prettycodes.png");
      });
    },

    init() {
      this.$refs.configPanel.changeEditorTheme(this.config.selectedEditorTheme);
      this.codeText =
        "// Simple program to calculate sum \n" +
        "var a = 12; \n" +
        "var b = 13; \n" +
        "var result = a + b; \n" +
        "console.log(result);";
      // this.codeText = prettier.format(this.codeText);
      this.codeHighlighted = hljs.highlight(
        this.config.selectedLanguage,
        this.codeText
      ).value;
      this.handleTemplateChange(this.config.selectedTemplate);
    },

    handleEditorThemeChange() {
      setTimeout(() => {
        this.stackBaseColor = window
          .getComputedStyle(document.querySelector(".hljs"))
          .getPropertyValue("background-color");

        this.$refs.stackOne.style.backgroundColor = fluctuateRgb(
          this.stackBaseColor,
          20
        );
        this.$refs.stackTwo.style.backgroundColor = fluctuateRgb(
          this.stackBaseColor,
          10
        );
      }, 1000);
    },

    handleStackThemeChange(stackThemeName) {
      this.config.selectedStackTheme = stackThemeName;
    },

    handleCodeEditorPaste(e) {
      e.preventDefault();
      this.codeText = e.clipboardData.getData("text");
      document.execCommand("inserttext", false, this.codeText);
      let hlData = hljs.highlightAuto(this.codeText);
      this.config.selectedLanguage = hlData.language;
      this.codeHighlighted = hlData.value;
    },

    handleCodeEditorChange(e) {
      this.codeText = e.target.innerText;
    },

    handleLanguageChange(languageName) {
      this.config.selectedLanguage = languageName;
      this.codeHighlighted = hljs.highlight(languageName, this.codeText).value;
    },

    handleTemplateChange(templateName) {
      let template = templates.find((t) => t.name == templateName);
      if (template) {
        Object.keys(template).forEach((key) => {
          this.config[key] = template[key];
        });
        this.$refs.configPanel.changeEditorTheme(
          this.config.selectedEditorTheme
        );
      }
    },
  },

  computed: {
    codePanelPos() {
      let pos = {
        x: window.innerWidth / 2 - 200 - 250,
        y: window.innerHeight / 2 - 200,
      };
      if (pos.x <= 0) pos.x = 100;
      return pos;
    },

    codePanelCss() {
      return "";
    },

    codeEditorInlineCss() {
      let extraCss = "";
      if (this.config.selectedBorderTheme === "none")
        extraCss = `
        border-top-left-radius: ${this.config.borderRadius}px;
        border-top-right-radius: ${this.config.borderRadius}px;
      `;
      return `
        ${extraCss}
        font-size: ${this.config.fontSize}px;
        border-bottom-left-radius: ${this.config.borderRadius}px;
        border-bottom-right-radius: ${this.config.borderRadius}px;
        font-family: ${this.config.fontFamily};
      `;
    },

    borderInlineCss() {
      return `
        border-top-left-radius: ${this.config.borderRadius}px; 
        border-top-right-radius: ${this.config.borderRadius}px;
      `;
    },

    screenshotInlineCss() {
      return `
        background-color: ${this.config.backgroundColor};
        padding: ${this.config.paddingY || 0}px ${this.config.paddingX || 0}px;
      `;
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
              width: 96%;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              z-index: -1;
            }

            &.--second {
              top: unset;
              width: 90%;
              bottom: -13px;
              left: 50%;
              transform: translateX(-50%);
              z-index: -2;
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
          // transform: translateY(1px);
          display: flex;
          transition: all 0.2s ease;

          $dotSize: 16px;
          .dot {
            height: $dotSize;
            width: $dotSize;
            background-color: white;
            border-radius: 50%;
            align-self: center;
            margin: 0 5px;
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
          transition: all 0.2s ease;
        }

        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>
<template>
  <div class="home">
    <div class="logo">
      <img src="@/assets/logo.svg" />
      <span class="appName">CodeShot</span>
    </div>

    <div class="appContainer">
      <div id="screenshot" class="codeContainer" :style="screenshotInlineCss">
        <pre id="code"><div id="border" class="hljs" :class="'--' + config.selectedBorderTheme" :style="borderInlineCss">
          <div class="dot dot-1"></div>
          <div class="dot dot-2"></div>
          <div class="dot dot-3"></div>
        </div><div
  ref="codeEditor"
  class="hljs code"
  v-html="codeHighlighted"
  contenteditable
  spellcheck="false"
  @paste="(e) => handleCodeEditorPaste(e)"
  @input="handleCodeEditorChange"
  :style="codeEditorInlineCss"
></div></pre>
      </div>
    </div>

    <ConfigPanel
      ref="configPanel"
      v-model="config"
      :value="config"
      @download="toCanvas()"
      @languageChange="handleLanguageChange"
    />
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import hljs from "highlight.js";
import { saveAs } from "file-saver";
import ConfigPanel from "@/components/ConfigPanel";

export default {
  name: "Home",
  components: { ConfigPanel },
  data() {
    return {
      codeText: null,
      codeHighlighted: null,
      config: {
        visible: true,
        selectedEditorTheme: "dracula",
        selectedBorderTheme: "theme-1",
        selectedLanguage: "javascript",
        fontSize: 16,
        fontFamily: '"Fira Code", monospace',
        paddingX: 50,
        paddingY: 50,
        borderRadius: 5,
        backgroundColor: "#2980b9",
      },
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    toCanvas() {
      html2canvas(document.querySelector("#screenshot")).then((canvas) => {
        canvas.toBlob(function (blob) {
          saveAs(blob, "prettycodes.png");
        });
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
      this.codeHighlighted = hljs.highlight(
        this.config.selectedLanguage,
        this.codeText
      ).value;
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
  },

  computed: {
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
.home {
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
      height: 48px;
      width: auto;
      margin-right: 0.5rem;
    }

    .appName {
      color: #00b2ff;
      font-size: 24px;
      align-self: center;
    }
  }

  .appContainer {
    width: calc(100vw - 250px);
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    .codeContainer {
      padding: 10px;
      background-color: white;
      min-width: 400px;
      resize: horizontal;
      overflow: auto;
      #code {
        margin-bottom: 0;
        margin-top: 0;

        #border {
          height: 40px;
          margin: 0;
          padding: 0;
          padding-left: 0.5rem;
          transform: translateY(1px);
          display: flex;

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
              background-color: transparent;
              border: 1px solid #fefefe;
            }
          }

          .dot {
            $size: 16px;
            height: $size;
            width: $size;
            background-color: white;
            border-radius: 50%;
            align-self: center;
            margin: 0 5px;
          }
        }

        .hljs {
          padding: 1.5rem 1rem;
          outline: none;
        }

        // box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        //   0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>
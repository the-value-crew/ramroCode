<template>
  <div class="home">
    <div class="canvasContainer" ref="canvasContainer"></div>

    <div class="logo">
      <img src="@/assets/logo.svg" />
      <span class="appName">CodeShot</span>
    </div>

    <div class="appContainer">
      <div id="screenshot" class="codeContainer" :style="screenshotInlineCss">
        <pre v-if="codeHighlighted" id="code"><div id="border" class="hljs" :class="'--' + config.selectedBorderTheme" :style="borderInlineCss"><div class="dot dot-1"></div><div class="dot dot-2"></div><div class="dot dot-3"></div></div><div
  ref="codeEditor"
  class="hljs code"
  v-html="codeHighlighted"
  contenteditable
  spellcheck="false"
  @paste="(e) => handleCodeEditorPaste(e)"
  :style="codeEditorInlineCss"
></div></pre>

        <div v-else class="pastePlaceholder" @click="pasteCode()">
          <h1 class="title">CodeShot</h1>
          <p class="subtitle">Beautiful screenshots of your code</p>

          <ul class="steps">
            <li>Copy code from anywhere</li>
            <li>Click here to paste</li>
            <li>Change configurations to get your design</li>
            <li>Download or share your codeshot</li>
          </ul>

          <p class="instructions">Click here to paste your code</p>
        </div>
      </div>
    </div>

    <div class="cpanel" :class="{'--hidden': !config.visible}">
      <div class="handle" @click="toggleConfig()">
        <i
          class="fal"
          :class="{'fa-angle-right': config.visible, 'fa-angle-left': !config.visible}"
        ></i>
      </div>
      <h1 class="title">Edit Panel</h1>

      <label>Border Theme</label>
      <select class="form-control" @input="(e) => changeBorderTheme(e.target.value)">
        <option
          v-for="borderTheme in borderThemes"
          :key="borderTheme.value"
          :value="borderTheme.value"
          :selected="borderTheme.value == config.selectedBorderTheme"
        >{{borderTheme.label}}</option>
      </select>

      <label>Editor Theme</label>
      <select class="form-control" @input="(e) => changeEditorTheme(e.target.value)">
        <option
          v-for="theme in hljsThemes"
          :value="theme.value"
          :selected="theme.value == config.selectedEditorTheme"
          :key="theme.value"
        >{{theme.label}}</option>
      </select>

      <label>Font Size</label>
      <RangeInput v-model="config.fontSize" :min="10" :max="40" :value="config.fontSize" />

      <label>Horizontal padding</label>
      <RangeInput v-model="config.paddingX" :min="0" :max="100" :value="config.paddingX" />

      <label>Vertical padding</label>
      <RangeInput v-model="config.paddingY" :min="0" :max="100" :value="config.paddingY" />

      <label>Rounded Corners</label>
      <RangeInput v-model="config.borderRadius" :min="0" :max="30" :value="config.borderRadius" />

      <div class="actionBtnContainer">
        <button class="actionBtn" @click="toCanvas()">
          <i class="fal fa-download"></i>
          <span>Download Image</span>
        </button>
        <button class="actionBtn" @click="toCanvas()">
          <i class="fal fa-cloud-upload"></i>
          <span>Upload to cloud</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import hljs from "highlight.js";
import { hljsThemes } from "@/data";
import humanizeString from "humanize-string";
import { saveAs } from "file-saver";
import RangeInput from "@/components/RangeInput";

export default {
  name: "Home",
  components: { RangeInput },
  data() {
    return {
      codeText: null,
      codeHighlighted: null,

      config: {
        visible: true,
        selectedEditorTheme: "dracula",
        selectedBorderTheme: "theme-1",
        fontSize: 12,
        paddingX: 0,
        borderRadius: 5,
      },

      borderThemes: [
        { label: "None", value: "none" },
        { label: "Theme 1", value: "theme-1" },
        { label: "Theme 2", value: "theme-2" },
        { label: "Theme 3", value: "theme-3" },
        { label: "Theme 4", value: "theme-4" },
      ],
    };
  },

  mounted() {
    this.changeEditorTheme(this.config.selectedEditorTheme);
  },

  methods: {
    toCanvas() {
      html2canvas(document.querySelector("#screenshot")).then((canvas) => {
        this.$refs.canvasContainer.innerHTML = "";
        canvas.toBlob(function (blob) {
          saveAs(blob, "pretty image.png");
        });
      });
    },

    async pasteCode() {
      this.codeText = await navigator.clipboard.readText();
      if (this.codeText.length > 0)
        this.codeHighlighted = hljs.highlightAuto(this.codeText).value;
      else this.codeHighlighted = null;
    },

    handleCodeEditorPaste(e) {
      e.preventDefault();

      let clipboardData = e.clipboardData.getData("text/plain");
      document.execCommand("inserttext", false, clipboardData);
      this.codeHighlighted = hljs.highlightAuto(clipboardData).value;
    },

    changeEditorTheme(themeFileName) {
      var head = document.getElementsByTagName("head")[0];
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "/hljs-themes/" + themeFileName + ".css";
      head.appendChild(link);
    },

    changeBorderTheme(themeName) {
      this.config.selectedBorderTheme = themeName;
    },

    toggleConfig() {
      this.config.visible = !this.config.visible;
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

    codeEditorInlineCss() {
      return (
        "font-size: " +
        this.config.fontSize +
        "px;" +
        "border-bottom-left-radius: " +
        this.config.borderRadius +
        "px; " +
        "border-bottom-right-radius: " +
        this.config.borderRadius +
        "px"
      );
    },

    borderInlineCss() {
      return (
        "border-top-left-radius: " +
        this.config.borderRadius +
        "px; " +
        "border-top-right-radius: " +
        this.config.borderRadius +
        "px"
      );
    },

    screenshotInlineCss() {
      return (
        "padding: " + this.config.paddingX + "px " + this.config.paddingY + "px"
      );
    },
  },
};
</script>


<style lang="scss">
.home {
  width: 100%;
  height: 100%;

  .logo {
    position: absolute;
    top: 1rem;
    left: 1rem;
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

      &:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      #border {
        height: 40px;
        transform: translateY(10px);
        margin: 0;
        padding: 0;
        padding-left: 0.5rem;
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
    }
  }

  .cpanel {
    width: 250px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background-color: #3f3b41;
    color: white;
    box-shadow: -5px 0px 5px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    transition: all 0.5s ease;

    &.--hidden {
      transform: translateX(100%);
    }

    .handle {
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-25px, 25%);
      height: 30px;
      width: 30px;
      background-color: #3f3b41;
      border-radius: 5px;
      color: white;
      cursor: pointer;

      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .title {
      text-align: center;
      font-size: 1.2rem;
    }

    .form-control {
      outline: none;
      color: black;
      padding: 0.5rem 1rem;
      border-radius: 0.2rem;
      background-color: white;
      margin: 0.5rem;
      margin-top: 0.15rem;
      margin-bottom: 1rem;
    }

    label {
      margin-left: 0.5rem;
    }

    .actionBtnContainer {
      width: 100%;
      display: flex;
      flex-grow: 1;

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
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        span {
          text-align: center;
        }
      }
    }
  }
}
.pastePlaceholder {
  min-height: 400px;
  min-width: 400px;
  border-radius: 5px;
  padding: 0 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .title {
    text-align: center;
    margin-bottom: 0;
  }

  .subtitle {
    text-align: center;
    margin-top: 0.25rem;
  }

  .steps {
    width: 250px;
    margin: 0 auto;
    margin-top: 2rem;
    margin-bottom: 2rem;
    li {
      margin-top: 1rem;
    }
  }

  .instructions {
    text-align: center;
  }
}
#code {
  margin-bottom: 0;
  margin-top: 0;
  .hljs {
    padding: 1.5rem 1rem;
    outline: none;
    font-family: "Courier New", Courier, monospace;
  }
}

.canvasContainer {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
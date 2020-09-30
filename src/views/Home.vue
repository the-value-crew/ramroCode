<template>
  <perfect-scrollbar class="home relative">
    <div class="logo absolute top-1 left-1">
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

    <div class="codePanel">
      <vue-draggable-resizable
        :w="500"
        :min-width="200"
        :min-height="200"
        :h="screenshotHeight"
        :x="codePanelPos.x"
        :y="codePanelPos.y"
        :handles="['mr']"
        :prevent-deactivation="true"
        class-name="resizeRect"
        class-name-handle="resizeHandle"
        @resizing="handleResize"
        :active="true"
        :draggable="!locked"
      >
        <div class="lock-handle" @click="toggleLock()">
          <i class="fal fa-lock-alt" v-if="locked"></i>
          <i class="fal fa-lock-open-alt" v-else></i>
        </div>

        <!-- <div class="warning">{{warning}}</div> -->
        <div id="screenshot" :style="screenshotInlineCss">
          <CodeEditor ref="ce" />
        </div>
      </vue-draggable-resizable>
    </div>

    <ConfigPanel ref="configPanel" />
  </perfect-scrollbar>
</template>

<script>
import ConfigPanel from "@/components/ConfigPanel";
import { mapFields } from "vuex-map-fields";
import CodeEditor from "@/components/CodeEditor";

export default {
  name: "Home",
  components: { ConfigPanel, CodeEditor },
  data() {
    return {
      warning: null,
    };
  },

  mounted() {},

  methods: {
    handleResize() {
      // this.$refs.ce.handleViewPortChange();
      // this.$refs.ce.fireEvent();

      // let cm = document.querySelector(".CodeMirror");
      // var hs = cm.scrollWidth > cm.clientWidth;
      // console.log("----", cm.scrollWidth, cm.clientWidth);
      // this.warning = hs ? "Scrollbar will be visible on screenshot" : "";
    },

    toggleLock() {
      this.locked = !this.locked;
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
      "config.borderRadiusOuter",
      "config.backgroundColor",
      "config.zoom",
      "config.shadow",
      "config.showLanguageName",
      "config.transform3d.x",
      "config.transform3d.y",
      "config.transform3d.z",
      "config.downloadLoading",
      "config.downloadImageQuality",
      "config.downloadImageScaling",
      "config.screenshotWidth",
      "config.screenshotHeight",
      "config.locked",
    ]),

    codePanelPos() {
      let pos = {
        x: window.innerWidth / 2 - 400 - 250 / 2,
        y: window.innerHeight / 2 - 200,
      };
      if (pos.x <= 0) pos.x = 100;
      return pos;
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
        height: ${this.screenshotHeight}px;
        border-radius: ${this.borderRadiusOuter}px;
        background-color: ${this.backgroundColor};
        padding: ${this.paddingY || 0}px ${this.paddingX || 0}px;
      `;
    },
  },
};
</script>

<style lang="scss">
.resizeHandle {
  position: absolute;
  // background-color: white;
  border: 3px dashed #3f3b41;
  border-radius: 5px;
  height: 90%;
  width: 15px;
  box-sizing: border-box;
  z-index: 1000;
  background-color: whitesmoke;

  &-mr {
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    cursor: e-resize;
  }
}

.resizeRect {
  position: relative;
  border: 3px dashed #3f3b41;
  // height: auto;
  border-radius: 5px;
  z-index: 1000;
  // height: auto;
  // overflow: auto;
}

.lock-handle {
  position: absolute;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  transform: translateX(-100%);
  cursor: pointer;
}

.home {
  position: relative;
  width: 100%;
  height: 100%;

  .logo {
    // position: fixed;
    // top: 1rem;
    // left: 1rem;
    // z-index: 1000;
    // display: flex;

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
        $min-width: 100px;

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
          min-width: $min-width;
          margin: 0;
          padding: 0;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          transition: all 0.2s ease;
          $dotSize: 16px;

          .dots {
            display: flex;
            align-self: center;
            margin-left: 0.5rem;
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
          // height: 100%;
          min-width: $min-width;
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
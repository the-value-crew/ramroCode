<template>
  <div class="colorPickerWrapper" ref="colorPickerWrapper">
    <v-swatches
      v-model="val"
      :swatches="swatches"
      show-fallback
      fallback-input-type="color"
      :swatch-size="20"
      shapes="circles"
      @input="handleInput"
    >
      <div slot="trigger" class="color-picker-handle" :style="'background-color: ' + val"></div>
    </v-swatches>
  </div>
</template>

<script>
import VSwatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.css";

export default {
  name: "ColorPicker",
  components: { VSwatches },
  props: ["value"],
  data() {
    return {
      val: this.value == "transparent" ? "" : this.value, //fix transparency issue
      swatches: [
        "",
        "#26A69A",
        "#66BB6A",
        "#9CCC65",
        "#D4E157",
        "#FFCA28",
        "#FFA726",
        "#FF7043",
        "#8D6E63",
        "#BDBDBD",
        "#78909C",
        "#29B6F6",
        "#5C6BC0",
        "#7E57C2",
        "#EC407A",
        "#ef5350",
      ],
    };
  },

  methods: {
    handleInput() {
      this.$emit("input", this.val || "transparent");
    },
  },

  watch: {
    value: function (newVal, oldVal) {
      if (newVal != oldVal) this.val = newVal;
    },
  },
};
</script>

<style lang="scss">
.color-picker-handle {
  width: 28px;
  height: 28px;
  border-radius: 3px;
  margin-bottom: 1rem;
  margin-top: 5px;
  border: 1px solid white;

  &::after {
    display: block;
    margin-left: 32px;
    content: "Background Color";
    font-size: 0.8rem;
  }
}

.vue-swatches {
  .vue-swatches__container {
    top: 40px !important;
    left: 0;
    // z-index: 10000;
  }

  .vue-swatches__wrapper {
    width: 200px !important; 
  }

  .vue-swatches__fallback__wrapper {
    width: 100% !important;
    margin-left: 0 !important;
  }

  .vue-swatches__fallback__button {
    display: none;
  }
}
</style>


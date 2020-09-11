<template>
  <div class="colorPickerWrapper" ref="colorPickerWrapper">
    <v-swatches
      v-model="val"
      show-fallback
      fallback-input-type="color"
      :swatch-size="40"
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
      val: this.value,
    };
  },

  methods: {
    handleInput() {
      this.$emit("input", this.val);
    },
  },
};
</script>

<style lang="scss">
.color-picker-handle {
  height: 28px;
  width: 28px;
  border-radius: 3px;
  margin: 0.5rem;
  margin-bottom: 1rem;
  margin-top: 5px;

  &::after {
    display: block;
    margin-left: 32px;
    content: "Background Color";
    font-size: 0.8rem;
  }
}

.vue-swatches {
  .vue-swatches__container {
    top: 30px !important;
    left: 0;
  }

  .vue-swatches__fallback__button {
    display: none;
  }
}
</style>


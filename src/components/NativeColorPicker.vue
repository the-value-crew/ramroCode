<template>
  <div class="nativeColorPickerWrapper" ref="nativeColorPickerWrapper">
    <!-- <div class="output" :style="outputStyle" @click="handleClick()"></div> -->
    <input type="color" v-model="val" class="output" ref="colorInput" @input="handleInput"/>
  </div>
</template>

<script>
export default {
  name: "NativeColorPicker",
  props: ["value"],
  data() {
    return {
      val: this.value,
    };
  },

  methods: {
    handleClick(){
      this.$refs.colorInput.click();
    },

    handleInput() {
      this.$emit("input", this.val);
    },
  },

  computed: {
    outputStyle() {
      return `
        background-color: ${this.val};
      `;
    },
  },

  watch: {
    value: function (newVal, oldVal) {
      if (newVal != oldVal) this.val = newVal;
    },
  },
};
</script>

<style lang="scss" scoped>
.nativeColorPickerWrapper {
  .output {
    padding: 0;
    border-radius: 10px;
    width: 100%;
    height: 20px;
    border: none;
    background-color: transparent;
  }
}
</style>

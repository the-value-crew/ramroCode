<template>
  <div class="rangeInputWrapper" ref="rangeInputWrapper">
    <vue-slider
      ref="slider"
      :min="min"
      :max="max"
      :height="2"
      :contained="true"
      :clickable="true"
      :tooltip="'active'"
      :tooltipPlacement="'top'"
      @change="handleChange"
      :value="val"
    >
    </vue-slider>
  </div>
</template>

<script>
export default {
  name: "RangeInput",
  components: {},
  props: ["min", "max", "value"],
  data() {
    return {
      val: this.value,
    };
  },

  methods: {
    handleChange(newPos) {
      this.$emit("input", newPos);
    },
  },
};
</script>

<style lang="scss">
$themeColor: white;
@import "vue-slider-component/lib/theme/default.scss";

.rangeInputWrapper{
  margin: 1rem 0.5rem;
}
</style>


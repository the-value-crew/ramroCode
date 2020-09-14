<template>
  <div class="rangeInputWrapper" ref="rangeInputWrapper">
    <span class="label" v-if="dotLabel">{{dotLabel}}</span>
    <vue-slider
      ref="slider"
      :min="min"
      :max="max"
      :height="1"
      :contained="true"
      :clickable="true"
      :tooltip="'none'"
      :tooltipPlacement="'top'"
      @change="handleChange"
      :value="val"
      v-model="val"
    >
      <template v-slot:dot>
        <div class="custom-dot" :style="dotStyle">{{val}}</div>
      </template>
    </vue-slider>
  </div>
</template>

<script>
export default {
  name: "RangeInput",
  components: {},
  props: ["min", "max", "value", "dotLabel", "dotWidth"],
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

  computed: {
    dotStyle() {
      if (this.dotWidth) return "width: " + this.dotWidth + "px";
      return "";
    },
  },

  watch: {
    value(newVal, oldVal) {
      if (newVal != oldVal) this.val = newVal;
    },
  },
};
</script>

<style lang="scss">
$themeColor: #3f3b41;
@import "vue-slider-component/lib/theme/default.scss";

.rangeInputWrapper {
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  display: flex;

  .custom-dot {
    background-color: white;
    height: 18px;
    width: 20px;
    border-radius: 3px;
    margin-top: -1px;
    color: #3f3b41;
    font-size: 0.7rem;
    text-align: center;
    line-height: 20px;
    font-weight: bold;
    cursor: pointer;
  }

  .label {
    align-self: center;
    font-size: 0.8rem;
    margin-right: 5px;
  }

  .vue-slider {
    flex: 1;
    align-self: center;
  }
}
</style>


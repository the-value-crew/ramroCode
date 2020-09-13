<template>
  <div class="rangeInputWrapper" ref="rangeInputWrapper">
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
        <div class="custom-dot">{{val}}</div>
      </template>
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

  watch:{
    value(oldVal, newVal){
      if(newVal != oldVal) this.val = newVal;
    }
  }
};
</script>

<style lang="scss">
$themeColor: #3f3b41;
@import "vue-slider-component/lib/theme/default.scss";

.rangeInputWrapper {
  margin-bottom: 1rem;
  margin-top: 0.5rem;

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
}
</style>


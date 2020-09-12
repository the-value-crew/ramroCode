<template>
  <div class="blobsInputWrapper" ref="blobsInputWrapper">
    <div class="checkboxWrapper">
      <input type="checkbox" id="checkbox" v-model="config.visible" />
      <label for="checkbox">Visible</label>
    </div>

    <div class="row">
      <div class="col">
        <label>Random:</label>
        <RangeInput v-model="config.randomness" :min="2" :max="10" :value="config.randomness" />
      </div>
      <div class="col">
        <label>Size:</label>
        <RangeInput v-model="config.size" :min="50" :max="200" :value="config.size" />
      </div>
    </div>

    <input type="color" v-model="config.backgroundColor" />

    <button class="btn" @click="generateNew()">Random</button>
  </div>
</template>

<script>
import * as blobs2 from "blobs/v2";
import RangeInput from "@/components/RangeInput";

export default {
  name: "BlobsInput",
  components: { RangeInput },
  props: ["value"],
  data() {
    return {
      config: this.value,
    };
  },

  methods: {
    handleChange(newPos) {
      this.$emit("input", newPos);
    },

    generateNew() {
      const svgPath = blobs2.svgPath({
        seed: Math.random(),
        extraPoints: 8,
        randomness: this.config.randomness,
        size: this.config.size,
      });
      this.config.svgPath = svgPath;
      this.$emit("generateBlob", this.config);
    },
  },

  watch: {
    value(oldVal, newVal) {
      if (newVal != oldVal) this.val = newVal;
    },
  },
};
</script>

<style lang="scss">
label {
  font-size: 0.8rem;
}
.blobsInputWrapper {
  border: 1px solid white;
  border-left: none;
  padding: 0.25rem;

  .checkboxWrapper {
    display: flex;
    label {
      user-select: none;
      align-self: center;
    }
  }
  .btn {
    outline: none;
    font-size: 0.8rem;
    background-color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
}
</style>


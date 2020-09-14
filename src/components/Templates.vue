<template>
  <perfect-scrollbar class="templates" :options="{useBothWheelAxes: true}">
    <div
      class="template"
      v-for="template in templates"
      :key="template.name"
      @click="selectTemplate(template.name)"
      :style="'background-image: url(/templates/' + template.name + '.png)'"
    >
      <i class="fal fa-badge-check check" v-if="template.name == val"></i>
    </div>
  </perfect-scrollbar>
</template>

<script>
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import { templates } from "@/data";

export default {
  name: "Templates",
  components: { PerfectScrollbar },
  props: ["value"],
  data() {
    return {
      val: null,
    };
  },

  created() {
    if (this.value) this.val = this.value;
  },

  methods: {
    selectTemplate(templateName) {
      this.val = templateName;
      this.$emit("input", templateName);
    },
  },

  computed: {
    templates() {
      return templates;
    },
  },
};
</script>

<style lang="scss">
.templates {
  display: flex;
  padding: 0.5rem;
  overflow-x: auto;

  .template {
    $size: 50px;

    position: relative;
    height: $size;
    width: $size;
    flex: 0 0 auto;
    border-radius: 3px;
    background-color: white;
    color: black;
    margin-right: 0.5rem;
    background-size: cover;
    cursor: pointer;

    .check {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: green;
      font-size: 2rem;
    }
  }
}

// .preset {
//   $size: 75px;
//   height: $size;
//   width: $size;
//   float: left;
//   // flex: 0 0 auto;
//   border-radius: 3px;
//   background-color: white;
//   margin-right: 0.5rem;
// }
</style>


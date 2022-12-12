<template>
  <div
    class="toast"
    :class="{
      error: type !== 'success',
    }"
  >
    <div class="toast-content">
      <i v-if="type === 'success'" class="uil uil-check check"></i>
      <i v-else class="uil uil-times check"></i>

      <div class="message">
        <span v-if="type === 'success'" class="text text-1">Success</span>
        <span v-else class="text text-1">Error</span>
        <span class="text text-2">{{ text }}</span>
      </div>
    </div>
    <i class="uil uil-times close" @click="closeToast"></i>

    <div class="progress"></div>
  </div>
</template>

<script>
export default {
  name: "ToastNotification",
  emits: ["hideToast"],
  props: {
    type: String,
    text: String,
  },
  mounted() {
    setTimeout(() => {
      this.closeToast();
    }, 5000);
  },
  methods: {
    closeToast() {
      const toast_elem = document.querySelector(".toast");
      if (toast_elem) {
        toast_elem.classList.add("hide");

        setTimeout(() => {
          this.$emit("hideToast");
        }, 500);
      }
    },
  },
};
</script>

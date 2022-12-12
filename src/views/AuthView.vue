<template>
  <ToastNotification
    v-if="toast"
    ref="toast"
    :type="toast.type"
    :text="toast.text"
    @hideToast="hideToast"
  ></ToastNotification>
  <SignupForm
    v-if="form === 'signup'"
    @changeForm="changeForm"
    @showToast="showToast"
  ></SignupForm>
  <LoginForm
    v-else-if="form === 'login'"
    @changeForm="changeForm"
    @showToast="showToast"
  ></LoginForm>
</template>

<script>
import ToastNotification from "../components/ToastNotification.vue";
import SignupForm from "../components/SignupForm.vue";
import LoginForm from "../components/LoginForm.vue";

export default {
  data() {
    return {
      form: "login",
      toast: null,
    };
  },
  components: {
    ToastNotification,
    SignupForm,
    LoginForm,
  },
  methods: {
    changeForm(form) {
      this.form = form;
    },
    showToast(type, text) {
      if (this.toast) {
        this.$refs.toast.closeToast();

        setTimeout(() => {
          this.toast = {
            type: type,
            text: text,
          };
        }, 500);
      } else {
        this.toast = {
          type: type,
          text: text,
        };
      }
    },
    hideToast() {
      this.toast = null;
    },
  },
};
</script>

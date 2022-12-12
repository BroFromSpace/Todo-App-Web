<template>
  <div class="container active" ref="container">
    <!-- REGISTRATION FORM -->
    <div class="form signup">
      <span class="title">Registration</span>

      <form action="submit" @submit.prevent="submitForm">
        <div
          class="input-field"
          :class="{ error: v$.name.$error, valid: !v$.name.$silentErrors }"
        >
          <input
            type="text"
            placeholder="Enter your name"
            v-model.trim="state.name"
          />
          <i class="uil uil-user"></i>
        </div>
        <span class="error-message" v-if="v$.name.$error">{{
          v$.name.$errors[0].$message
        }}</span>
        <div
          class="input-field"
          :class="{ error: v$.email.$error, valid: !v$.email.$silentErrors }"
        >
          <input
            type="email"
            placeholder="Enter your email"
            v-model.trim="state.email"
          />
          <i class="uil uil-envelope icon"></i>
        </div>
        <span class="error-message" v-if="v$.name.$error">{{
          v$.email.$errors[0].$message
        }}</span>
        <div
          class="input-field"
          :class="{
            error: v$.password.password.$error,
            valid: !v$.password.password.$silentErrors,
          }"
        >
          <input
            v-if="show_password"
            type="text"
            class="password"
            placeholder="Create a password"
            v-model.trim="state.password.password"
          />
          <input
            v-else
            type="password"
            class="password"
            placeholder="Create a password"
            v-model.trim="state.password.password"
          />
          <i class="uil uil-lock icon"></i>
        </div>
        <span class="error-message" v-if="v$.name.$error">{{
          v$.password.password.$errors[0].$message
        }}</span>
        <div
          class="input-field"
          :class="{
            error: v$.password.confirm.$error,
            valid: !v$.password.confirm.$silentErrors,
          }"
        >
          <input
            v-if="show_password"
            type="text"
            class="password"
            placeholder="Confirm a password"
            v-model.trim="state.password.confirm"
          />
          <input
            v-else
            type="password"
            class="password"
            placeholder="Confirm a password"
            v-model.trim="state.password.confirm"
          />
          <i class="uil uil-lock icon"></i>
          <i
            v-if="show_password"
            class="uil uil-eye showHidePw"
            @click="() => (show_password = false)"
          ></i>
          <i
            v-else
            class="uil uil-eye-slash showHidePw"
            @click="() => (show_password = true)"
          ></i>
        </div>
        <span class="error-message" v-if="v$.name.$error">{{
          v$.password.confirm.$errors[0].$message
        }}</span>

        <div class="input-field button">
          <input type="submit" value="Signup" />
        </div>
      </form>

      <div class="login-signup">
        <span class="text"
          >Already a member?
          <a class="text login-link" @click="$emit('changeForm', 'login')">
            Login Now
          </a>
        </span>
      </div>
    </div>
    <!-- /REGISTRATION FORM -->
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
} from "@vuelidate/validators";

export default {
  name: "SignupForm",
  emits: ["changeForm", "showToast"],
  data() {
    const state = reactive({
      name: "",
      email: "",
      password: {
        password: "",
        confirm: "",
      },
    });
    const rules = computed(() => {
      return {
        name: {
          required,
          min_length: minLength(4),
          max_length: maxLength(32),
        },
        email: {
          required,
          email,
        },
        password: {
          password: {
            required,
            min_length: minLength(4),
            max_length: maxLength(32),
          },
          confirm: {
            required,
            same_as_password: sameAs(state.password.password),
          },
        },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
      show_password: false,
      enable_submit_form: true,
    };
  },
  methods: {
    async submitForm() {
      const is_from_valid = await this.v$.$validate();
      if (!is_from_valid) return;
      const url = `${import.meta.env.VITE_API_BASE_URL}/auth/signup`;
      const data = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password.password,
      };
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            const error = data.detail;
            return Promise.reject(error);
          }
          return data;
        })
        .then(() => {
          const user_data = JSON.stringify({
            email: this.state.email,
            password: this.state.password.password,
          });
          localStorage.setItem("user", user_data);
          this.$emit(
            "showToast",
            "success",
            "You are successfully registered."
          );
          this.$emit("changeForm", "login");
        })
        .catch((error) => {
          if (error.code === "user-already-exists") {
            this.$emit("showToast", "error", error.msg);
          } else {
            this.$emit("showToast", "error", "Woops... Something got wrong.");
          }
        });
    },
  },
};
</script>

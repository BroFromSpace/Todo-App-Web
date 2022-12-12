<template>
  <body>
    <div class="container">
      <!--  LOGIN FORM  -->
      <div class="form login">
        <span class="title">Login</span>

        <form action="submit" @submit.prevent="submitForm">
          <div
            class="input-field"
            :class="{ error: v$.email.$error, valid: !v$.email.$silentErrors }"
          >
            <input
              type="email"
              placeholder="Enter your email"
              v-model.trim.trim="state.email"
            />
            <i class="uil uil-envelope icon"></i>
          </div>
          <span class="error-message" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
          <div
            class="input-field"
            :class="{
              error: v$.password.$error,
              valid: !v$.password.$silentErrors,
            }"
          >
            <input
              v-if="show_password"
              type="text"
              class="password"
              placeholder="Enter your password"
              v-model.trim="state.password"
            />
            <input
              v-else
              type="password"
              class="password"
              placeholder="Enter your password"
              v-model.trim="state.password"
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
          <span class="error-message" v-if="v$.password.$error">{{
            v$.password.$errors[0].$message
          }}</span>

          <div class="checkbox-text">
            <div class="checkbox-content">
              <input
                type="checkbox"
                id="logCheck"
                v-model.trim="state.remember_user"
              />
              <label for="logCheck" class="text">Remember me</label>
            </div>

            <a href="#" class="text">Forgot password?</a>
          </div>

          <div class="input-field button">
            <input type="submit" value="Login" />
          </div>
        </form>

        <div class="login-signup">
          <span class="text"
            >Not a member?
            <a class="text signup-link" @click="$emit('changeForm', 'signup')">
              Signup Now
            </a>
          </span>
        </div>
      </div>
      <!--  /LOGIN FORM  -->
    </div>
  </body>
</template>

<script>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

export default {
  name: "LoginForm",
  emits: ["changeForm", "showToast"],
  data() {
    const state = reactive({
      email: "",
      password: "",
      remember_user: false,
    });

    const rules = computed(() => {
      return {
        email: {
          required,
          email,
        },
        password: {
          required,
        },
      };
    });

    const v$ = useVuelidate(rules, state);

    return {
      state,
      v$,
      show_password: false,
    };
  },
  mounted() {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);

      this.state.email = user.email;
      this.state.password = user.password;

      localStorage.removeItem("user");
    }
  },
  methods: {
    async submitForm() {
      this.v$.$validate();
      const is_form_valid = await this.v$.$validate();
      if (!is_form_valid) return;

      const url = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
      const params = {
        username: this.state.email,
        password: this.state.password,
      };
      const data = Object.keys(params)
        .map((key) => {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
          );
        })
        .join("&");

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            const error = data.detail;
            return Promise.reject(error);
          }
          return data;
        })
        .then((data) => {
          if (this.state.remember_user) {
            localStorage.setItem("jwt", data.access_token);
          } else {
            sessionStorage.setItem("jwt", data.access_token);
          }
          this.$emit("showToast", "success", "You are successfully log inned.");
          this.$router.push("/");
        })
        .catch((error) => {
          if (error.code === "invalid-user") {
            this.$emit("showToast", "error", error.msg);
          } else {
            this.$emit("showToast", "error", "Woops... Something got wrong.");
          }
        });
    },
  },
};
</script>

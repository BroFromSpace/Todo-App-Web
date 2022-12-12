<template>
  <div class="container">
    <div class="container-title">
      <p>My todo lists</p>
    </div>
    <div class="container-header">
      <div class="list-input-field">
        <textarea
          placeholder="Enter your new todo list"
          v-model.trim="state.list_name"
        ></textarea>
        <span><i class="uil uil-plus note-icon" @click="createList"></i></span>
      </div>
    </div>
    <div class="container-body">
      <ul v-if="lists.length">
        <ListItem
          v-for="list in lists"
          v-bind="$attrs"
          :key="list.id"
          :list_id="list.id"
          :list_name="list.name"
          @openTodoList="$emit('openTodoList', list)"
          @updateList="updateList"
          @deleteList="deleteList"
        ></ListItem>
      </ul>
      <p v-else>You don't have any todo lists.</p>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import ListItem from "./ListItem.vue";
import getJWT from "../helper.js";

export default {
  name: "TodoListSelect",
  emits: ["showToast", "openTodoList"],
  data() {
    const state = reactive({
      list_name: "",
    });

    const rules = computed(() => {
      return {
        list_name: {
          required,
          min_length: minLength(4),
          max_length: maxLength(64),
        },
      };
    });

    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
      lists: [],
    };
  },
  components: {
    ListItem,
  },
  created() {
    this.getLists();
  },
  methods: {
    async getLists() {
      const token = getJWT();
      const url = `${import.meta.env.VITE_API_BASE_URL}/todo-lists/`;
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          this.lists = data.results;
        })
        .catch(() => {
          this.$emit("showToast", "error", "Woops... Something got wrong.");
        });
    },
    async createList() {
      const is_todo_list_valid = await this.v$.$validate();
      if (!is_todo_list_valid) return;

      const token = getJWT();
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/todo-lists/`);
      const params = {
        list_name: this.state.list_name,
      };
      url.search = new URLSearchParams(params).toString();
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
          this.state.list_name = "";

          this.getLists();
          this.$emit("showToast", "success", "New list successfully created.");
        })
        .catch(() => {
          this.$emit("showToast", "error", "Woops... Something got wrong.");
        });
    },
    async updateList(list_id, list_name) {
      const token = getJWT();
      const url = new URL(
        `${import.meta.env.VITE_API_BASE_URL}/todo-lists/${list_id}`
      );
      const params = {
        list_name: list_name,
      };
      url.search = new URLSearchParams(params).toString();
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
          this.getLists();
        })
        .catch(() => {
          this.$emit("showToast", "error", "Woops... Something got wrong.");
        });
    },
    async deleteList(list_id) {
      const token = getJWT();
      const url = new URL(
        `${import.meta.env.VITE_API_BASE_URL}/todo-lists/${list_id}`
      );
      fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          this.getLists();
          this.$emit("showToast", "success", "List successfully deleted.");
        })
        .catch(() => {
          this.$emit("showToast", "error", "Woops... Something got wrong.");
        });
    },
  },
};
</script>

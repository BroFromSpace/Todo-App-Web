<template>
  <div class="container">
    <div class="container-title">
      <p>{{ list.name }}</p>
    </div>
    <div class="container-header">
      <div class="list-input-field">
        <textarea
          placeholder="Enter your new todo"
          v-model.trim.trim="state.task_name"
        ></textarea>
        <span><i class="uil uil-plus note-icon" @click="createTask"></i></span>
      </div>
      <div class="list-controls">
        <div class="list-filters">
          <span
            :class="{ active: show_tasks === 'all' }"
            id="all"
            @click="() => (show_tasks = 'all')"
            >All</span
          >
          <span
            id="pending"
            :class="{ active: show_tasks === 'pending' }"
            @click="() => (show_tasks = 'pending')"
            >Pending</span
          >
          <span
            id="completed"
            :class="{ active: show_tasks === 'completed' }"
            @click="() => (show_tasks = 'completed')"
            >Completed</span
          >
        </div>
        <button class="clear-btn active" @click="clearAll">Clear All</button>
      </div>
    </div>
    <div class="container-body">
      <ul v-if="tasksToShow.length">
        <TaskItem
          v-for="task in tasksToShow"
          :key="task.id"
          :task_id="task.id"
          :task_name="task.name"
          :task_finished="task.finished"
          @deleteTask="deleteTask"
          @updateTask="updateTask"
        ></TaskItem>
      </ul>
      <p v-else>You don't have any todo.</p>
    </div>
    <div class="back" @click="$emit('openTodoLists')">
      <i class="uil uil-arrow-left"></i>
      <span>Back</span>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import TaskItem from "./TaskItem.vue";
import getJWT from "../helper.js";

export default {
  name: "TodoList",
  emits: ["showToast", "openTodoLists"],
  props: ["list"],
  data() {
    const state = reactive({
      task_name: "",
    });

    const rules = computed(() => {
      return {
        task_name: {
          required,
          min_length: minLength(4),
          max_length: maxLength(512),
        },
      };
    });

    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
      tasks: [],
      show_tasks: "all",
    };
  },
  components: {
    TaskItem,
  },
  created() {
    this.getTasks();
  },
  methods: {
    async getTasks() {
      const token = getJWT();
      const url = `${import.meta.env.VITE_API_BASE_URL}/todo-lists/${
        this.list.id
      }`;
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
          this.tasks = data.tasks;
        })
        .catch(() => {
          this.$emit("showToast", "error", "Woops... Something got wrong.");
        });
    },
    async createTask() {
      const is_task_valid = await this.v$.$validate();
      if (!is_task_valid) return;

      const token = getJWT();
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/tasks/`);
      const params = {
        list_id: this.list.id,
        task_name: this.state.task_name,
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
          this.state.task_name = "";

          this.getTasks();
          this.$emit("showToast", "success", "New todo successfully created.");
        })
        .catch(() => {
          this.$emit("showToast", "error", "Woops... Something got wrong.");
        });
    },
    async updateTask(event, task_id, task_name, task_finished) {
      const token = getJWT();
      const url = new URL(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${task_id}`
      );
      const params = {
        task_name: task_name,
        finished: !task_finished,
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
          this.getTasks();
        })
        .catch(() => {
          this.$emit("showToast", "error", "Woops... Something got wrong.");
        });
    },
    async deleteTask(task_id) {
      const token = getJWT();
      const url = new URL(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${task_id}`
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
          this.getTasks();
          this.$emit("showToast", "success", "Todo successfully deleted.");
        })
        .catch(() => {
          this.$emit("showToast", "error", "Woops... Something got wrong.");
        });
    },
    async clearAll() {
      this.pendingTasks.map((task) => {
        this.updateTask(null, task.id, task.name, task.finished);
      });
    },
  },
  computed: {
    pendingTasks() {
      return this.tasks.filter((task) => {
        return !task.finished;
      });
    },
    completedTasks() {
      return this.tasks.filter((task) => {
        return task.finished;
      });
    },
    tasksToShow() {
      if (this.show_tasks === "pending") {
        return this.pendingTasks;
      } else if (this.show_tasks === "completed") {
        return this.completedTasks;
      } else {
        return this.tasks;
      }
    },
  },
};
</script>

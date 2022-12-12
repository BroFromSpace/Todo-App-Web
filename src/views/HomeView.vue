<template>
  <ToastNotification
    v-if="toast"
    ref="toast"
    :type="toast.type"
    :text="toast.text"
    @hideToast="hideToast"
  ></ToastNotification>
  <TodoListSelect
    v-if="stage === 'list-select'"
    @showToast="showToast"
    @openTodoList="openTodoList"
  ></TodoListSelect>
  <TodoList
    v-else-if="stage === 'tasks'"
    :list="current_list"
    @showToast="showToast"
    @openTodoLists="openTodoLists"
  ></TodoList>
</template>

<script>
import ToastNotification from "../components/ToastNotification.vue";
import TodoListSelect from "../components/TodoListSelect.vue";
import TodoList from "../components/TodoList.vue";

export default {
  data() {
    return {
      toast: null,
      stage: "list-select",
      current_list: "",
    };
  },
  components: {
    ToastNotification,
    TodoListSelect,
    TodoList,
  },
  methods: {
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
    openTodoList(list) {
      this.current_list = list;
      this.stage = "tasks";
    },
    openTodoLists() {
      this.current_list = null;
      this.stage = "list-select";
    },
  },
};
</script>

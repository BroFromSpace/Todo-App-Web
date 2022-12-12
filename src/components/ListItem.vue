<template>
  <li class="list-simple">
    <i class="uil uil-circle"></i>
    <textarea
      v-if="edit"
      class="task"
      ref="name"
      v-model.trim="state.name"
    ></textarea>
    <span v-else class="task" @click="$emit('openTodoList')">{{
      list_name
    }}</span>
    <div class="settings">
      <div v-if="edit">
        <i class="uil uil-check" @click="saveChanges"></i>
        <i class="uil uil-times" @click="cancelChanges"></i>
      </div>
      <div v-else>
        <i class="uil uil-pen" @click="editName"></i>
        <i class="uil uil-trash-alt" @click="$emit('deleteList', list_id)"></i>
      </div>
    </div>
  </li>
</template>

<script>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "ListItem",
  emits: ["openTodoList", "updateList", "deleteList"],
  props: {
    list_id: Number,
    list_name: String,
  },
  data() {
    const state = reactive({
      name: this.list_name,
    });

    const rules = computed(() => {
      return {
        name: {
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
      edit: false,
    };
  },
  methods: {
    editName() {
      this.edit = true;
      setTimeout(() => {
        this.$refs.name.focus();
      }, 100);
    },
    async saveChanges() {
      const is_name_valid = await this.v$.$validate();
      if (!is_name_valid) return;

      this.$emit("updateList", this.list_id, this.state.name);
      this.edit = false;
    },
    async cancelChanges() {
      this.edit = false;
    },
  },
};
</script>

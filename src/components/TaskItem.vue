<template>
  <li class="list">
    <input
      type="checkbox"
      @change="$emit('updateTask', $event, task_id, task_name, task_finished)"
      :checked="task_finished"
    />
    <span class="task">{{ task_name }}</span>
    <i class="uil uil-trash-alt" @click="$emit('deleteTask', task_id)"></i>
  </li>
</template>

<script>
export default {
  name: "TaskItem",
  emits: ["deleteTask", "updateTask"],
  props: {
    task_id: Number,
    task_name: String,
    task_finished: Boolean,
  },
};
</script>

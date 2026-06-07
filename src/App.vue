<script setup lang="ts">
import { ref } from "vue";

const input = ref("");
const lines = ref<string[]>(['type "help" to see available commands']);

const commands: Record<string, string> = {
  help: "help\nabout\nclear",
  about: "portfolio terminal",
};

function run() {
  const command = input.value.trim().toLowerCase();
  input.value = "";

  if (!command) return;

  if (command === "clear") {
    lines.value = [];
    return;
  }

  lines.value.push(`$ ${command}`);
  lines.value.push(commands[command] ?? `command not found: ${command}`);
}
</script>

<template>
  <main>
    <div id="output">{{ lines.join("\n") }}</div>
    <form @submit.prevent="run">
      <label for="input">$</label>
      <input id="input" v-model="input" autofocus autocomplete="off" />
    </form>
  </main>
</template>

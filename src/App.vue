<script setup lang="ts">
import { computed, ref } from "vue";
import { commandNames, files, help, sections, type SectionName } from "./commands";
import WebsiteView from "./WebsiteView.vue";

type Output =
  | { kind: "text"; value: string }
  | { kind: "section"; name: SectionName };

const input = ref("");
const output = ref<Output[]>([
  { kind: "text", value: "welcome! i'm savina" },
  { kind: "text", value: 'type "help" to see available commands' },
]);
const history = ref<string[]>([]);
const historyIndex = ref(0);
const cwd = ref<keyof typeof files>("~");
const theme = ref("purple");
const mode = ref<"terminal" | "website">("terminal");

const prompt = computed(() => `savina@portfolio:${cwd.value}$`);

function print(value: string) {
  output.value.push({ kind: "text", value });
}

function showSection(name: SectionName) {
  output.value.push({ kind: "section", name });
}

function resolveSection(value: string): SectionName | undefined {
  const normalized = value.replace(/\.txt$|\.log$|\.sh$|\//g, "");
  if (normalized === "notes") return "writing";
  if (normalized === "terminal-portfolio") return "work";
  return normalized in sections ? (normalized as SectionName) : undefined;
}

function changeDirectory(target: string) {
  if (!target || target === "~" || target === "..") {
    cwd.value = "~";
    return;
  }

  const path = `~/${target.replace(/\/$/, "")}` as keyof typeof files;
  if (path in files) {
    cwd.value = path;
    return;
  }

  print(`cd: no such directory: ${target}`);
}

function run(value = input.value) {
  const raw = value.trim();
  input.value = "";
  if (!raw) return;

  history.value.push(raw);
  historyIndex.value = history.value.length;

  const [command, ...args] = raw.toLowerCase().split(/\s+/);

  if (command === "clear") {
    output.value = [];
    return;
  }

  output.value.push({ kind: "text", value: `${prompt.value} ${raw}` });

  if (command in sections) {
    showSection(command as SectionName);
    return;
  }

  if (command === "help") print(help);
  else if (command === "ls") print(files[cwd.value].join("  "));
  else if (command === "pwd") print(cwd.value.replace("~", "/home/savina"));
  else if (command === "cd") changeDirectory(args[0]);
  else if (command === "cat" || command === "open") {
    const section = resolveSection(args[0] ?? "");
    section ? showSection(section) : print(`${command}: nothing found`);
  } else if (command === "theme") {
    const nextTheme = args[0];
    if (["purple", "blue", "mono"].includes(nextTheme)) theme.value = nextTheme;
    else print("themes: purple  blue  mono");
  } else if (command === "whoami") print("savina — developer, learner, and maker");
  else if (command === "website") mode.value = "website";
  else print(`command not found: ${command}`);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowUp" && historyIndex.value > 0) {
    event.preventDefault();
    input.value = history.value[--historyIndex.value];
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    historyIndex.value = Math.min(historyIndex.value + 1, history.value.length);
    input.value = history.value[historyIndex.value] ?? "";
  } else if (event.key === "Tab") {
    event.preventDefault();
    const matches = commandNames.filter((name) => name.startsWith(input.value));
    if (matches.length === 1) input.value = matches[0];
    else if (matches.length > 1) print(matches.join("  "));
  }
}
</script>

<template>
  <WebsiteView v-if="mode === 'website'" @terminal="mode = 'terminal'" />

  <div v-else class="page" :class="`theme-${theme}`">
    <main class="terminal">
      <div id="output">
        <template v-for="(item, index) in output" :key="index">
          <p v-if="item.kind === 'text'">{{ item.value }}</p>
          <component :is="sections[item.name]" v-else />
        </template>
      </div>

      <form @submit.prevent="run()">
        <label for="input">{{ prompt }}</label>
        <input
          id="input"
          v-model="input"
          autofocus
          autocomplete="off"
          @keydown="handleKeydown"
        />
      </form>

      <nav aria-label="Quick commands">
        <button v-for="name in ['about', 'work', 'writing', 'contact', 'website']" :key="name" @click="run(name)">
          {{ name }}
        </button>
      </nav>

      <footer>{{ cwd }} · {{ theme }} · tab to autocomplete · ↑↓ for history</footer>
    </main>
  </div>
</template>

const output = document.querySelector("#output");
const form = document.querySelector("#form");
const input = document.querySelector("#input");

const commands = {
  help: "help\nabout\nclear",
  about: "portfolio terminal",
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const command = input.value.trim().toLowerCase();
  input.value = "";

  if (!command) return;

  if (command === "clear") {
    output.textContent = "";
    return;
  }

  const result = commands[command] ?? `command not found: ${command}`;
  output.textContent += `\n$ ${command}\n${result}`;
});

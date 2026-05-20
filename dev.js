import { spawn } from "node:child_process";
import process from "node:process";

const run = (name, command, args) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  child.on("exit", (code) => {
    if (code) console.error(`${name} exited with code ${code}`);
  });

  return child;
};

const server = run("server", process.execPath, ["server.js"]);
const vite = run("vite", process.execPath, ["./node_modules/vite/bin/vite.js", "--host", "127.0.0.1"]);

const shutdown = () => {
  server.kill();
  vite.kill();
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}

function runNpm(args) {
  if (isWindows) {
    return run(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", ["npm", ...args].join(" ")]);
  }
  return run("npm", args);
}

async function main() {
  console.log("[check:web] tests");
  await runNpm(["run", "test", "--workspace=apps/web"]);
  console.log("[check:web] production build");
  await runNpm(["run", "build", "--workspace=apps/web"]);
  console.log("[check:web] ok");
}

main().catch((error) => {
  console.error(`[check:web] failed: ${error.message}`);
  process.exit(1);
});

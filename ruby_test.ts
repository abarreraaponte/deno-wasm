import fs from "node:fs/promises";
import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/node";

import { fetch_json } from "./wasm_env.ts";

async function runRubyWasmFSTestWithHTTP() {
  const rubyWasmPath = "./node_modules/@ruby/3.4-wasm-wasi/dist/ruby+stdlib.wasm";
  const rubyScriptPath = "./ruby.rb";

  try {
    const binary = await fs.readFile(rubyWasmPath);
    const module = await WebAssembly.compile(binary);

    // CRUCIAL CHANGE: Directly expose fetch_json to Node.js's globalThis.
    // The Ruby Wasm VM's JS environment will then see this via `JS.global`.
    (globalThis as any).fetch_json_from_host = fetch_json;

    const { vm } = await DefaultRubyVM(module);

    console.log("Running Ruby Wasm filesystem and HTTP access test...");

	const rubyScriptContent = await fs.readFile(rubyScriptPath, 'utf8');

    vm.evalAsync(rubyScriptContent);

    console.log("\nRuby Wasm filesystem and HTTP access test finished.");

	vm.evalAsync(rubyScriptContent);

  } catch (error) {
    console.error("An error occurred during Ruby Wasm execution:", error);
  } finally {
    // Clean up the global reference to avoid polluting Node.js global
    if ((globalThis as any).fetch_json_from_host) {
      delete (globalThis as any).fetch_json_from_host;
    }
  }
}

runRubyWasmFSTestWithHTTP();
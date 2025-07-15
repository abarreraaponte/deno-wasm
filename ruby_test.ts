import fs from "node:fs/promises";
import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/node";

async function runRubyWasmFSTest() {
  const rubyWasmPath = "./node_modules/@ruby/3.4-wasm-wasi/dist/ruby.wasm";
  const rubyScriptPath = "./ruby.rb";

  try {
    // Load the Ruby Wasm binary
    const binary = await fs.readFile(rubyWasmPath);
    const module = await WebAssembly.compile(binary);

    // Load the Ruby script content
    const rubyScriptContent = await fs.readFile(rubyScriptPath, 'utf8');

    // Instantiate the Ruby VM
    // The DefaultRubyVM handles providing the WASI imports internally.
    const { vm } = await DefaultRubyVM(module);

    console.log("Running Ruby Wasm filesystem access test...");

    // Execute the Ruby script
    vm.eval(rubyScriptContent);

    console.log("\nRuby Wasm filesystem access test finished.");

  } catch (error) {
    console.error("An error occurred during Ruby Wasm execution:", error);
  }
}

runRubyWasmFSTest();
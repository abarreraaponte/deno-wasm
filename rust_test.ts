import { readFileSync } from "node:fs";
import { now, print_time_ms, log_result } from "./wasm_env.ts";

async function runWatTest() {
  const wasmFilePath = "./rust.wasm";

  try {
	const wasmBytes = readFileSync(wasmFilePath);

	const importObject = {
	  env: {
		now: now,
		print_time_ms: print_time_ms,
		log_result: log_result,
	  },
	};

	const { instance } = await WebAssembly.instantiate(wasmBytes, importObject);

	const runTestFunc = instance.exports.run_test;

	if (typeof runTestFunc !== 'function') {
	  console.error("Error: 'run_test' export not found or not a function in WASM module.");
	  return;
	}

	const fibInput = 42;

	console.log(`Calling Wasm's 'run_test' with fibInput=${fibInput}...`);

	runTestFunc(fibInput);

	console.log("Wasm 'run_test' execution finished.");

  } catch (error) {
	console.error("An error occurred:", error);
  }
}

runWatTest();
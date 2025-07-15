import fs from "node:fs/promises";
import { loadPyodide } from "pyodide";
import { now, print_time_ms, log_result, fetch_json } from "./wasm_env.ts";

const main = async () => {

  const pyodide = await loadPyodide();

  /*global.kitledger = global.kitledger || {};
  global.kitledger.now = now;
  global.kitledger.print_time_ms = print_time_ms;
  global.kitledger.log_result = log_result;
  global.kitledger.fetch_json = fetch_json;*/
  pyodide.registerJsModule('kitledger', {
	now: now,
	fetch_json: fetch_json,
	print_time_ms: print_time_ms,
	log_result: log_result,
  });

  //pyodide.mountNodeFS('.', '.');

  const pythonCode = await fs.readFile('python.py', 'utf8');

  await pyodide.runPythonAsync(pythonCode);
};

main().catch(err => {
    console.error("Caught an error in main:", err);
    process.exit(1);
});
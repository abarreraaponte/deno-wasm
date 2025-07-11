export function now() : number {
  return performance.now();
}

export function print_time_ms(duration :number) : void {
  console.log(`Wasm execution took: ${duration.toFixed(2)} ms`);
}

export function log_result(result: number) : void {
  console.log(`Wasm calculated fibonacci result: ${result}`);
}

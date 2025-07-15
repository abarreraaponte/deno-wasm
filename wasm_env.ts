export function now() : number {
  return performance.now();
}

export function print_time_ms(duration :number) : void {
  console.log(`Wasm execution took: ${duration.toFixed(2)} ms`);
}

export function log_result(result: number) : void {
  console.log(`Wasm calculated fibonacci result: ${result}`);
}

export async function fetch_json(url: string) {
  try {
    console.log(`[Host] Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    console.log(`[Host] Fetched ${data.length} bytes from ${url}`);
    return data;
  } catch (error: any) {
    console.error(`[Host] Error fetching ${url}: ${error.message}`);
    return JSON.stringify({ error: error.message });
  }
 
}
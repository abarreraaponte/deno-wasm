#![no_std]
extern crate alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}

#[link(wasm_import_module = "env")]
extern "C" {
    fn now() -> f64;
    fn print_time_ms(duration: f64);
    fn log_result(result: i32);
}

// Your existing fib function (recursive)
#[unsafe(no_mangle)]
pub extern "C" fn fib(n: i32) -> i32 {
    if n <= 1 {
        return n;
    }
    fib(n-1) + fib(n-2)
}

// Export a `run_test` function that orchestrates the execution and calls host functions.
#[unsafe(no_mangle)]
pub extern "C" fn run_test(fib_input: i32) {
    unsafe {
        let start_time = now();

        let mut result_accumulator = 0;
        // Call fib(fib_input) multiple times to ensure a measurable duration.
        // For recursive fib(42), even 1 iteration is significant (hundreds of ms).
        // Looping 5 times will make it take several seconds, ensuring a clear measurement.
        for _ in 0..5 {
            result_accumulator = fib(fib_input);
        }

        let end_time = now();
        let duration = end_time - start_time;

        print_time_ms(duration);
        // Log the result of the last computation in the loop.
        log_result(result_accumulator);
    }
}
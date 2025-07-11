(module
  ;; ----------------------------------------------------------------
  ;; SECTION 1: IMPORTS
  ;; These are the functions that your host runtime must provide.
  ;; ----------------------------------------------------------------

  ;; Imports a function to get the current time (e.g., in milliseconds).
  (import "env" "now" (func $now (result f64)))

  ;; Imports a function to print the calculated time duration.
  (import "env" "print_time_ms" (func $print_time (param f64)))

  ;; Imports a generic logger function to be called with a result.
  (import "env" "log_result" (func $log_result (param i32)))


  ;; ----------------------------------------------------------------
  ;; SECTION 2: INTERNAL LOGIC
  ;; This is a computationally intensive function for performance testing.
  ;; ----------------------------------------------------------------
  (func $fib (param $n i32) (result i32)
    (if (result i32)
      (i32.lt_s (local.get $n) (i32.const 2))
      (then (local.get $n))
      (else
        (i32.add
          (call $fib (i32.sub (local.get $n) (i32.const 1)))
          (call $fib (i32.sub (local.get $n) (i32.const 2)))
        )
      )
    )
  )

  ;; ----------------------------------------------------------------
  ;; SECTION 3: EXPORTED TEST RUNNER
  ;; This is the main function you will call from your host runtime.
  ;; ----------------------------------------------------------------
  (func (export "run_test") (param $fib_input i32)
    (local $start_time f64)
    (local $fib_result i32)

    ;; --- Part A: Run calculation and time it ---
    (call $now)
    (local.set $start_time)

    (call $fib (local.get $fib_input))
    (local.set $fib_result)

    ;; Calculate duration and call host to print it
    (f64.sub (call $now) (local.get $start_time))
    (call $print_time)

    ;; --- Part B: Call the generic host logger ---
    (call $log_result (local.get $fib_result))
  )
)
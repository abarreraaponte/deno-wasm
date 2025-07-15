//go:build tinygo.wasm

package main

//go:wasmimport env now
func _now() float64

//go:wasmimport env print_time_ms
func _print_time_ms(duration float64)

//go:wasmimport env log_result
func _log_result(result int32)

func fib(n int32) int32 {
    if n <= 1 {
        return n
    }
    return fib(n-1) + fib(n-2)
}

//export run_test
func run_test(fibInput int32) {
    startTime := _now()

    fibResult := fib(fibInput)

    duration := _now() - startTime
    _print_time_ms(duration)

    _log_result(fibResult)
}

func main() {}
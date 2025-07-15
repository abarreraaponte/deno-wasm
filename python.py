import js
import json
import time

#js_now = js.kitledger.now
#js_fetch_json = js.kitledger.fetch_json
#js_print_time_ms = js.kitledger.print_time_ms
#js_log_result = js.kitledger.log_result

import kitledger
js_now = kitledger.now
js_fetch_json = kitledger.fetch_json
js_print_time_ms = kitledger.print_time_ms
js_log_result = kitledger.log_result


print("--- Python Pyodide Environment Tests ---")

python_start_time = js_now()
print(f"Python: Host performance.now() at start: {python_start_time:.2f} ms")

print("--- Filesystem Access Tests ---")
try:
    with open("/etc/passwd", "r") as f:
        system_file_content = f.read()
    print(f"SUCCESS: Read /etc/passwd. Content snippet: {system_file_content[0:50]}...")
except Exception as e:
    print(f"FAIL: Could not read /etc/passwd. Error: {e}")

print("---")

try:
    with open("test_file.txt", "r") as f:
        local_file_content = f.read()
    print(f"SUCCESS: Read local file. Content: {local_file_content.strip()}")
except Exception as e:
    print(f"FAIL: Could not read local file. Error: {e}")

print("---")

try:
    with open("python_pyodide_output.txt", "w") as f:
        f.write("Hello from Python Pyodide!")
    print("SUCCESS: Wrote python_pyodide_output.txt")
except Exception as e:
    print(f"FAIL: Could not write python_pyodide_output.txt. Error: {e}")

print("--- HTTP Call Test ---")

http_call_start_time = js_now()
start_time_process = time.perf_counter()

try:
    json_url = "https://jsonplaceholder.typicode.com/todos/1"

    response_json_string = await js_fetch_json(json_url)
    
    print(f"HTTP Response (raw): {response_json_string[0:100]}...")
    
    parsed_data = json.loads(response_json_string)
    print(f"HTTP Response (parsed title): {parsed_data['title']}")

except Exception as e:
    print(f"FAIL: HTTP call failed. Error: {e}")

http_call_end_time = js_now()
http_call_duration_host = http_call_end_time - http_call_start_time
print(f"HTTP call + processing took: {http_call_duration_host:.2f} ms (measured by host clock)")

end_time_process = time.perf_counter()
duration_process = (end_time_process - start_time_process) * 1000
print(f"HTTP call + processing took: {duration_process:.2f} ms (measured by Python's time.perf_counter)")

python_end_time = js_now()
total_python_execution_duration = python_end_time - python_start_time
js_print_time_ms(total_python_execution_duration)

js_log_result(12345) # Example call to log_result

print("--- End of Python Pyodide Tests ---")
require "js"

puts "--- Filesystem Access Tests ---"
begin
  system_file_content = File.read("/etc/passwd")
  puts "SUCCESS: Read /etc/passwd. Content snippet: #{system_file_content[0..50]}..."
rescue => e
  puts "FAIL: Could not read /etc/passwd. Error: #{e.message}"
end

puts "---"

begin
  local_file_content = File.read("test_file.txt")
  puts "SUCCESS: Read local file. Content: #{local_file_content.strip}"
rescue => e
  puts "FAIL: Could not read local file. Error: #{e.message}"
end

puts "---"

begin
  File.write("ruby_wasm_output.txt", "Hello from Ruby Wasm!")
  puts "SUCCESS: Wrote ruby_wasm_output.txt"
rescue => e
  puts "FAIL: Could not write ruby_wasm_output.txt. Error: #{e.message}"
end

puts "---"

puts "--- HTTP Call Test ---"

start_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)

begin
  json_url = "https://jsonplaceholder.typicode.com/todos/1"

  response_json_object = JS.global.fetch_json_from_host(json_url).await
  response_json_string = response_json_object.to_s

  puts "HTTP Response (raw): #{response_json_string[0..100]}..."
  require 'json'
  parsed_data = JSON.parse(response_json_string)
  puts "HTTP Response (parsed title): #{parsed_data['title']}"

rescue => e
  puts "FAIL: HTTP call failed. Error: #{e.message}"
end

end_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)
duration = (end_time - start_time) * 1000
puts "HTTP call + processing took: #{duration.round(2)} ms"

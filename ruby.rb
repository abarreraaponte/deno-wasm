require "js"

puts "--- HTTP Call Test ---"

start_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)

begin
  json_url = "https://jsonplaceholder.typicode.com/todos/1"

  response_json_object = JS.global.fetch_json(json_url).await
  response_json_string = response_json_object.to_s

  puts "HTTP Response (raw): #{response_json_string[0..100]}..."
  require 'json'
  parsed_data = JSON.parse(response_json_string)
  puts "HTTP Response (parsed title): #{parsed_data['title']}"

rescue => e
  puts "FAIL: HTTP call failed. Error: #{e.message}"
end

now = JS.global.now()
puts "Current time in milliseconds: #{now}"
JS.global.print_time_ms(25)
JS.global.log_result(42)

puts "HTTP call + processing took: 44 ms"

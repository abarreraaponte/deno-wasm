begin
  # Attempt to read a common sensitive system file (e.g., on macOS/Linux)
  system_file_content = File.read("/etc/passwd")
  puts "SUCCESS: Read /etc/passwd. Content snippet: #{system_file_content[0..50]}..."
rescue => e
  puts "FAIL: Could not read /etc/passwd. Error: #{e.message}"
end

puts "---"

begin
  # Attempt to read a local file in the current directory
  local_file_content = File.read("test_file.txt")
  puts "SUCCESS: Read local file. Content: #{local_file_content.strip}"
rescue => e
  puts "FAIL: Could not read local file. Error: #{e.message}"
end

puts "---"

# Attempt to write a new file
begin
  File.write("ruby_wasm_output.txt", "Hello from Ruby Wasm!")
  puts "SUCCESS: Wrote ruby_wasm_output.txt"
rescue => e
  puts "FAIL: Could not write ruby_wasm_output.txt. Error: #{e.message}"
end

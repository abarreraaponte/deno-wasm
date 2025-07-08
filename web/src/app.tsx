import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  async function callTestJson() {
    const response = await fetch("/api/test-json");
    const data: { count: number; status: string } = await response.json();
    setCount(data.count);
  }

  return (
    <>
      <div>
        { count }
        <button type="button" onClick={() => callTestJson()}>Call Test JSON</button>
      </div>
    </>
  )
}

export default App

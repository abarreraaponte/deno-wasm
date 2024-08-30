import { trpc } from "./tools/trpc"
import { useEffect, useState } from "react";

function App() {

	const [name, setName] = useState('world');

	useEffect(() => {
		trpc.hello.query({name: 'Alejandro'}).then(setName);
	});
	
	return (
		<>
			<h1>{name}</h1>
			<button className="btn btn-primary">Button</button>
		</>
	)
}	

export default App

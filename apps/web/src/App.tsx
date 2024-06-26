import { authorize, getMessages } from '@repo/store/index'
import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)
 const handleAuth = async () =>{
 const res =  await fetch("http://localhost:8081/")
 const data = await res.json()
 console.log(data)
 }
  return (
    <div className=''>
      <h1>welcome to outreach.ai</h1>
      <button onClick={handleAuth}>connect</button>
    </div>
  )
}

export default App

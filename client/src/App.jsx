
import {useState,useEffect} from "react"
import {io} from "socket.io-client"

const socket = io(import.meta.env.https://advanced-chat-app-two.vercel.app/)

export default function App(){

const [user,setUser] = useState("")
const [target,setTarget] = useState("")
const [message,setMessage] = useState("")
const [chat,setChat] = useState([])
const [typing,setTyping] = useState("")

useEffect(()=>{
socket.on("receive_message",(data)=>{
setChat(prev=>[...prev,data])
})

socket.on("typing",(from)=>{
setTyping(from + " is typing...")
setTimeout(()=>setTyping(""),1500)
})
},[])

const join=()=>{
socket.emit("join",user)
}

const send=()=>{
socket.emit("send_message",{from:user,to:target,message})
setChat(prev=>[...prev,{from:user,message}])
setMessage("")
}

const handleTyping=()=>{
socket.emit("typing",{from:user,to:target})
}

return(
<div style={{fontFamily:"Arial",padding:20}}>

<h2>Advanced Chat</h2>

<div>
<input placeholder="Your ID"
value={user}
onChange={e=>setUser(e.target.value)}
/>

<button onClick={join}>Join</button>
</div>

<br/>

<div>
<input placeholder="Send To User ID"
value={target}
onChange={e=>setTarget(e.target.value)}
/>
</div>

<br/>

<div style={{height:300,overflow:"auto",border:"1px solid #ccc",padding:10}}>
{chat.map((c,i)=>(
<div key={i}>
<b>{c.from}:</b> {c.message}
</div>
))}
</div>

<div>{typing}</div>

<br/>

<input
value={message}
onChange={e=>{
setMessage(e.target.value)
handleTyping()
}}
placeholder="Type message"
/>

<button onClick={send}>Send</button>

</div>
)
}


const express = require("express")
const http = require("http")
const cors = require("cors")
const mongoose = require("mongoose")
const { Server } = require("socket.io")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

const server = http.createServer(app)

const io = new Server(server, {
  cors:{origin:"*"}
})

let onlineUsers = {}

io.on("connection",(socket)=>{

  socket.on("join",(userId)=>{
    onlineUsers[userId] = socket.id
    io.emit("online_users",Object.keys(onlineUsers))
  })

  socket.on("send_message",(data)=>{
    const target = onlineUsers[data.to]
    if(target){
      io.to(target).emit("receive_message",data)
    }
  })

  socket.on("typing",(data)=>{
    const target = onlineUsers[data.to]
    if(target){
      io.to(target).emit("typing",data.from)
    }
  })

  socket.on("disconnect",()=>{
    for(const user in onlineUsers){
      if(onlineUsers[user] === socket.id){
        delete onlineUsers[user]
      }
    }
    io.emit("online_users",Object.keys(onlineUsers))
  })
})

app.get("/",(req,res)=>{
  res.send("Advanced Chat API running")
})

server.listen(process.env.PORT || 5000,()=>{
  console.log("Server started")
})

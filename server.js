const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

server.listen(3000, ()=> console.log('Sucesso! websocket'));

app.use(express.static(path.join(__dirname,"public")))

let connectedUsers = [];
var regex = /<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g //prevent xss
io.on('connection', (socket)=>{
    console.log('Alguem se conectou!')
    socket.on('entrada-tentativa', (username)=>{
        username = username.replace(regex,'&lt;$1&gt;')


        socket.username = username
        connectedUsers.push(username)
        console.log(connectedUsers)
        socket.emit('conectados',connectedUsers)
        socket.broadcast.emit('users-updated',{
            joined: username,
            list:connectedUsers
        })
    })

    socket.on('user-send-message',(obj)=>{
        socket.broadcast.emit('message-receive',{
            user:obj.user,
            msg:obj.msg.replace(regex,'')
        })
    })


    socket.on('disconnect', ()=>{
        connectedUsers = connectedUsers.filter(user => user != socket.username)

        socket.broadcast.emit('users-updated',{
            left: socket.username,
            list:connectedUsers
        })
    })


})
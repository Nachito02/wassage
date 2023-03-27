import express from 'express'
import connectDB from './config/db.js'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import { Server } from 'socket.io'
const app = express()

app.use(express.json())

dotenv.config()

connectDB()

app.use(cors({
    origin: process.env.FRONTEND_URL
}))



//rutas

app.use('/api/users',userRoutes)

// servidor listening

const PORT = process.env.PORT || 3001

const server = app.listen(PORT,"0.0.0.0",() => {
    console.log('servidor corriendo en el puerto: ' , PORT)
})

const io = new Server(server,{
    pingTimeout: 6000,
    cors: {
        origin:process.env.FRONTEND_URL
    }
})


io.on('connection', (socket) => {
 

    console.log('conectado a socket io')

    socket.on('open chat', (id) => {
        socket.join(id)
    })

    socket.on("new message", (data) => {
        console.log(data)
        socket.to(data.chatRoom).emit('new message',data)
    })


    
})

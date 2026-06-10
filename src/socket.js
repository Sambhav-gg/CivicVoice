const { Server } = require('socket.io')

let io

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        console.log(`[WS] Client connected: ${socket.id}`)

        socket.on('disconnect', () => {
            console.log(`[WS] Client disconnected: ${socket.id}`)
        })
    })

    return io
}

const getIO = () => {
    if (!io) throw new Error('Socket.io not initialized')
    return io
}

module.exports = { initSocket, getIO }
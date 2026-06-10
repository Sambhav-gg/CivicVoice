import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL || `${window.location.protocol}//${window.location.hostname}` || 'http://localhost:5000'

let socket = null

export const getSocket = () => {
    console.log('SOCKET_URL:', SOCKET_URL)

    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['polling', 'websocket']
        })

    }

    return socket
}

export const useSocket = (event, handler) => {
    const handlerRef = useRef(handler)
    handlerRef.current = handler

    useEffect(() => {
        const s = getSocket()
        const fn = (...args) => handlerRef.current(...args)

        s.on(event, fn)

        return () => s.off(event, fn)
    }, [event])
}
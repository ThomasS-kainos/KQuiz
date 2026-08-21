import { useEffect, useEffectEvent, useState } from 'react'

export type ServerMessage = {
  type: 'teams-update' | 'start-game' | 'next-question' | 'show-answer' | 'show-leaderboard'
}

function getWebSocketUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = import.meta.env.DEV ? `${window.location.hostname}:3000` : window.location.host

  return `${protocol}//${host}`
}

type WebSocketOptions = {
  onOpen?: () => void
  onMessage?: (message: ServerMessage) => void
}

export function useWebSocket({ onOpen, onMessage }: WebSocketOptions = {}) {
  const [status, setStatus] = useState('Connecting...')

  const handleOpen = useEffectEvent(() => {
    onOpen?.()
  })

  const handleMessage = useEffectEvent((message: ServerMessage) => {
    onMessage?.(message)
  })

  useEffect(() => {
    let reconnectTimer: number | undefined
    let isActive = true
    let socket: WebSocket | undefined

    function connect() {
      socket = new WebSocket(getWebSocketUrl())

      socket.onopen = () => {
        setStatus('Connected')
        handleOpen()
      }

      socket.onmessage = (event) => {
        handleMessage(JSON.parse(event.data) as ServerMessage)
      }

      socket.onclose = () => {
        if (!isActive) {
          return
        }

        setStatus('Disconnected - reconnecting...')
        reconnectTimer = window.setTimeout(connect, 2000)
      }
    }

    connect()

    return () => {
      isActive = false
      window.clearTimeout(reconnectTimer)
      socket?.close()
    }
  }, [])

  return { status }
}
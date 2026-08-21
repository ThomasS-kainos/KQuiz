import { useEffect, useRef, useState } from 'react'

export function useEmojiPicker() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleOutsideClick(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
    }
  }, [isOpen])

  function toggle() {
    setIsOpen((open) => !open)
  }

  function closePicker() {
    setIsOpen(false)
  }

  return { containerRef, isOpen, toggle, closePicker }
}

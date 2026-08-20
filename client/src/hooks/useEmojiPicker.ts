import { useEffect, useRef, useState } from 'react'

export function useEmojiPicker(initialEmoji: string) {
  const [selectedEmoji, setSelectedEmoji] = useState(initialEmoji)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  function toggle() {
    setIsOpen((open) => !open)
  }

  function selectEmoji(emoji: string) {
    setSelectedEmoji(emoji)
    setIsOpen(false)
  }

  return { containerRef, selectedEmoji, isOpen, toggle, selectEmoji }
}

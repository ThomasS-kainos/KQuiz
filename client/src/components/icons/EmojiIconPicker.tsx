import { emojiOptions } from '../../constants/emojiOptions'
import { useEmojiPicker } from '../../hooks/useEmojiPicker'
import { TeamIcon } from './teamIcon'

type EmojiIconPickerProps = {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiIconPicker({ value, onChange }: EmojiIconPickerProps) {
  const { containerRef, isOpen, toggle, closePicker } = useEmojiPicker()

  function handleSelect(emoji: string) {
    closePicker()
    onChange(emoji)
  }

  return (
    <div className="emoji-picker" ref={containerRef}>
      <button
        type="button"
        className="emoji-picker-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <TeamIcon icon={value} label="Selected team icon" size="large" />
        <span className="emoji-picker-hint">Choose icon</span>
      </button>

      {isOpen && (
        <div className="emoji-picker-popover" role="listbox" aria-label="Team icon options">
          {emojiOptions.map((emoji) => (
            <button
              type="button"
              key={emoji}
              className="emoji-picker-option"
              role="option"
              aria-selected={emoji === value}
              onClick={() => handleSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

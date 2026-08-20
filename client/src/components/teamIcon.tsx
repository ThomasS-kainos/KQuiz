type TeamIconProps = {
  icon: string
  label?: string
  size?: 'small' | 'large'
}

// Renders a team's icon as either an emoji badge or an image URL (legacy dicebear avatars).
export function TeamIcon({ icon, label, size = 'small' }: TeamIconProps) {
  const isImageIcon = icon.startsWith('http://') || icon.startsWith('https://')

  return (
    <span className={`team-icon team-icon--${size}`} role="img" aria-label={label ?? 'Team icon'}>
      {isImageIcon ? <img src={icon} alt={label ?? 'Team icon'} /> : icon}
    </span>
  )
}

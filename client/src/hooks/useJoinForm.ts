import { type FormEvent, useState } from 'react'

import { emojiOptions } from '../emojiOptions'

type UseJoinFormOptions = {
  onJoin: (teamName: string, teamIcon: string) => Promise<void>
}

export function useJoinForm({ onJoin }: UseJoinFormOptions) {
  const [teamName, setTeamName] = useState('')
  const [teamIcon, setTeamIcon] = useState<string>(emojiOptions[0])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onJoin(teamName, teamIcon)
  }

  return { teamName, setTeamName, teamIcon, setTeamIcon, handleSubmit }
}

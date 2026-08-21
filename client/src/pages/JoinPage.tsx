import { ConnectionPill } from '../components/core/connectionPill'
import { EmojiIconPicker } from '../components/EmojiIconPicker'
import { StringFieldEntry } from '../components/stringFeildEntry'
import { useJoinForm } from '../hooks/useJoinForm'

type JoinPageProps = {
  status: string
  onJoin: (teamName: string, teamIcon: string) => Promise<void>
}

export function JoinPage({ status, onJoin }: JoinPageProps) {
  const { teamName, setTeamName, teamIcon, setTeamIcon, handleSubmit } = useJoinForm({ onJoin })

  return (
    <main className="lobby-page join-page">
      <section className="lobby-panel join-panel" aria-labelledby="join-title">
        <div className="join-top">
          <ConnectionPill status={status} />
          <h1 id="join-title" className="join-title">Kainos Quiz</h1>
        </div>

        <div className="join-icon-section">
          <EmojiIconPicker value={teamIcon} onChange={setTeamIcon} />
        </div>

        <form className="join-form join-bottom" onSubmit={handleSubmit}>
          <StringFieldEntry
            id="teamName"
            value={teamName}
            onChange={setTeamName}
            maxLength={24}
            required
            className="string-field-entry--rounded"
            placeholder="Enter your team name"
          />

          <button type="submit" className="join-button">Join</button>
        </form>
      </section>
    </main>
  )
}

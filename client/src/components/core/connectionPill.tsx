export function ConnectionPill({ status }: { status: string }) {
    return (
        <p className="connection-status">{status}</p>
    )
}
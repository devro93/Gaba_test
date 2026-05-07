import type { User } from '../types'
import { UserCard } from './UserCard'

type UserGridProps = {
  users: User[]
}

export function UserGrid({ users }: UserGridProps) {
  if (users.length === 0) {
    return <p className="status-msg">No users matched your filters.</p>
  }

  return (
    <ul className="cards-grid">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ul>
  )
}

import type { User } from '../types'

type UserCardProps = {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  return (
    <li className="user-card">
      <div className="card-top">
        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} loading="lazy" />
        <div>
          <h3>
            {user.firstName} {user.lastName}
          </h3>
          <p className="muted">@{user.username}</p>
        </div>
      </div>

      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
      <p>
        <strong>Location:</strong> {user.address?.city}, {user.address?.country}
      </p>
      <p>
        <strong>Role:</strong> {user.company?.title} at {user.company?.name}
      </p>

      <div className="tags-row">
        <span>{user.gender}</span>
        <span>{user.age} years</span>
        <span>{user.company?.department ?? 'Unknown dept'}</span>
      </div>
    </li>
  )
}

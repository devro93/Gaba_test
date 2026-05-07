import type { User } from '../types'
import { UserGrid } from './UserGrid'
import { Pagination } from './Pagination'

type ResultsPanelProps = {
  loading: boolean
  error: string | null
  pageUsers: User[]
  currentPage: number
  totalPages: number
  matchedCount: number
  onPageChange: (page: number) => void
}

export function ResultsPanel({
  loading,
  error,
  pageUsers,
  currentPage,
  totalPages,
  matchedCount,
  onPageChange,
}: ResultsPanelProps) {
  if (loading) {
    return <p className="status-msg">Loading users...</p>
  }

  if (error) {
    return <p className="status-msg error">{error}</p>
  }

  return (
    <section className="results-panel" aria-live="polite">
      <div className="results-meta">
        <p>
          Showing page {currentPage} of {totalPages}
        </p>
        <p>{matchedCount} matched profiles</p>
      </div>

      <UserGrid users={pageUsers} />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </section>
  )
}

import { StatsCard } from './StatsCard'

type StatsGridProps = {
  visibleUsers: number
  averageAge: string
  uniqueCountries: number
  mostCommonDepartment: string
}

export function StatsGrid({
  visibleUsers,
  averageAge,
  uniqueCountries,
  mostCommonDepartment,
}: StatsGridProps) {
  return (
    <section className="stats-grid" aria-label="Overview statistics">
      <StatsCard label="Visible users" value={visibleUsers} />
      <StatsCard label="Average age" value={averageAge} />
      <StatsCard label="Countries" value={uniqueCountries} />
      <StatsCard label="Top department" value={mostCommonDepartment} />
    </section>
  )
}

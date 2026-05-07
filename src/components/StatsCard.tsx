type StatCardProps = {
  label: string
  value: string | number
}

export function StatsCard({ label, value }: StatCardProps) {
  return (
    <article className="stat-card">
      <h2>{label}</h2>
      <p>{value}</p>
    </article>
  )
}

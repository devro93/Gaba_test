import { useState } from 'react'
import { useUsers } from './hooks/useUsers'
import { useFilteredUsers } from './hooks/useFilteredUsers'
import type { FilterState } from './types'
import { Header } from './components/Header'
import { StatsGrid } from './components/StatsGrid'
import { Filters } from './components/Filters'
import { ResultsPanel } from './components/ResultsPanel'

function App() {
  const { users, loading, error } = useUsers()

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    genderFilter: 'all',
    countryFilter: 'all',
    departmentFilter: 'all',
    sortBy: 'name-asc',
  })

  const [currentPage, setCurrentPage] = useState(1)

  const {
    countries,
    departments,
    sortedUsers,
    totalPages,
    activePage,
    pageUsers,
    filteredUsers,
    averageAge,
    uniqueCountries,
    mostCommonDepartment,
  } = useFilteredUsers(users, filters, currentPage)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  return (
    <main className="dashboard-shell">
      <Header />
      <StatsGrid
        visibleUsers={filteredUsers.length}
        averageAge={averageAge}
        uniqueCountries={uniqueCountries}
        mostCommonDepartment={mostCommonDepartment}
      />
      <Filters
        filters={filters}
        countries={countries.filter((c): c is string => c !== undefined)}
        departments={departments.filter((d): d is string => d !== undefined)}
        onFilterChange={handleFilterChange}
      />
      <ResultsPanel
        loading={loading}
        error={error}
        pageUsers={pageUsers}
        currentPage={activePage}
        totalPages={totalPages}
        matchedCount={sortedUsers.length}
        onPageChange={setCurrentPage}
      />
    </main>
  )
}

export default App

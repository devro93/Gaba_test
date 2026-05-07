import type { FilterState } from '../types'

type FiltersProps = {
  filters: FilterState
  countries: string[]
  departments: string[]
  onFilterChange: (key: keyof FilterState, value: string) => void
}

export function Filters({
  filters,
  countries,
  departments,
  onFilterChange,
}: FiltersProps) {
  return (
    <section className="controls-panel" aria-label="Filters and sorting">
      <label className="control">
        <span>Search</span>
        <input
          type="search"
          placeholder="Name, email, username, or company"
          value={filters.searchTerm}
          onChange={(event) => onFilterChange('searchTerm', event.target.value)}
        />
      </label>

      <label className="control">
        <span>Gender</span>
        <select
          value={filters.genderFilter}
          onChange={(event) => onFilterChange('genderFilter', event.target.value)}
        >
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>

      <label className="control">
        <span>Country</span>
        <select
          value={filters.countryFilter}
          onChange={(event) => onFilterChange('countryFilter', event.target.value)}
        >
          <option value="all">All</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>

      <label className="control">
        <span>Department</span>
        <select
          value={filters.departmentFilter}
          onChange={(event) => onFilterChange('departmentFilter', event.target.value)}
        >
          <option value="all">All</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </label>

      <label className="control">
        <span>Sort by</span>
        <select
          value={filters.sortBy}
          onChange={(event) => onFilterChange('sortBy', event.target.value)}
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="age-asc">Age low-high</option>
          <option value="age-desc">Age high-low</option>
        </select>
      </label>
    </section>
  )
}

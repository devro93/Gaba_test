import { useEffect, useMemo, useState } from 'react'

type User = {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  image: string
  company?: {
    department?: string
    name?: string
    title?: string
  }
  address?: {
    city?: string
    state?: string
    country?: string
  }
}

type UsersResponse = {
  users: User[]
}

const PAGE_SIZE = 12

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const abortController = new AbortController()

    const loadUsers = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('https://dummyjson.com/users?limit=250', {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to fetch users.')
        }

        const data = (await response.json()) as UsersResponse
        setUsers(data.users)
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === 'AbortError') {
          return
        }

        setError('Could not load users. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    void loadUsers()

    return () => {
      abortController.abort()
    }
  }, [])

  const countries = useMemo(() => {
    return [...new Set(users.map((user) => user.address?.country).filter(Boolean))].sort()
  }, [users])

  const departments = useMemo(() => {
    return [...new Set(users.map((user) => user.company?.department).filter(Boolean))].sort()
  }, [users])

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      const companyName = user.company?.name?.toLowerCase() ?? ''
      const userCountry = user.address?.country ?? ''
      const userDepartment = user.company?.department ?? ''

      const matchesSearch =
        term.length === 0 ||
        fullName.includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        companyName.includes(term)

      const matchesGender = genderFilter === 'all' || user.gender === genderFilter
      const matchesCountry = countryFilter === 'all' || userCountry === countryFilter
      const matchesDepartment = departmentFilter === 'all' || userDepartment === departmentFilter

      return matchesSearch && matchesGender && matchesCountry && matchesDepartment
    })
  }, [countryFilter, departmentFilter, genderFilter, searchTerm, users])

  const sortedUsers = useMemo(() => {
    const clone = [...filteredUsers]

    clone.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      }
      if (sortBy === 'name-desc') {
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`)
      }
      if (sortBy === 'age-asc') {
        return a.age - b.age
      }
      if (sortBy === 'age-desc') {
        return b.age - a.age
      }
      return a.id - b.id
    })

    return clone
  }, [filteredUsers, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE))

  const activePage = Math.min(currentPage, totalPages)

  const pageUsers = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE
    return sortedUsers.slice(start, start + PAGE_SIZE)
  }, [activePage, sortedUsers])

  const averageAge = useMemo(() => {
    if (filteredUsers.length === 0) {
      return '0.0'
    }

    const total = filteredUsers.reduce((sum, user) => sum + user.age, 0)
    return (total / filteredUsers.length).toFixed(1)
  }, [filteredUsers])

  const uniqueCountries = useMemo(() => {
    return new Set(filteredUsers.map((user) => user.address?.country).filter(Boolean)).size
  }, [filteredUsers])

  const mostCommonDepartment = useMemo(() => {
    if (filteredUsers.length === 0) {
      return 'n/a'
    }

    const counter = new Map<string, number>()

    for (const user of filteredUsers) {
      const department = user.company?.department ?? 'Unknown'
      counter.set(department, (counter.get(department) ?? 0) + 1)
    }

    return [...counter.entries()].sort((a, b) => b[1] - a[1])[0][0]
  }, [filteredUsers])

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Test Assignment</p>
          <h1>Users Dashboard</h1>
          <p className="subtitle">
            Browse, filter, and inspect user profiles from DummyJSON in a fast, responsive
            interface.
          </p>
        </div>
      </header>

      <section className="stats-grid" aria-label="Overview statistics">
        <article className="stat-card">
          <h2>Visible users</h2>
          <p>{filteredUsers.length}</p>
        </article>
        <article className="stat-card">
          <h2>Average age</h2>
          <p>{averageAge}</p>
        </article>
        <article className="stat-card">
          <h2>Countries</h2>
          <p>{uniqueCountries}</p>
        </article>
        <article className="stat-card">
          <h2>Top department</h2>
          <p>{mostCommonDepartment}</p>
        </article>
      </section>

      <section className="controls-panel" aria-label="Filters and sorting">
        <label className="control">
          <span>Search</span>
          <input
            type="search"
            placeholder="Name, email, username, or company"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setCurrentPage(1)
            }}
          />
        </label>

        <label className="control">
          <span>Gender</span>
          <select
            value={genderFilter}
            onChange={(event) => {
              setGenderFilter(event.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label className="control">
          <span>Country</span>
          <select
            value={countryFilter}
            onChange={(event) => {
              setCountryFilter(event.target.value)
              setCurrentPage(1)
            }}
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
            value={departmentFilter}
            onChange={(event) => {
              setDepartmentFilter(event.target.value)
              setCurrentPage(1)
            }}
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
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="age-asc">Age low-high</option>
            <option value="age-desc">Age high-low</option>
          </select>
        </label>
      </section>

      <section className="results-panel" aria-live="polite">
        {loading && <p className="status-msg">Loading users...</p>}
        {!loading && error && <p className="status-msg error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="results-meta">
              <p>
                Showing page {activePage} of {totalPages}
              </p>
              <p>{sortedUsers.length} matched profiles</p>
            </div>

            {pageUsers.length === 0 ? (
              <p className="status-msg">No users matched your filters.</p>
            ) : (
              <ul className="cards-grid">
                {pageUsers.map((user) => (
                  <li key={user.id} className="user-card">
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
                ))}
              </ul>
            )}

            <div className="pagination-row">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={activePage === 1}
              >
                Previous
              </button>
              <span>
                {activePage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={activePage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default App

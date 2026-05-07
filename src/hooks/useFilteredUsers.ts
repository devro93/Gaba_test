import { useMemo } from 'react'
import type { User, FilterState } from '../types'

const PAGE_SIZE = 12

export function useFilteredUsers(users: User[], filters: FilterState, currentPage: number) {
  const countries = useMemo(() => {
    return [...new Set(users.map((user) => user.address?.country).filter(Boolean))].sort()
  }, [users])

  const departments = useMemo(() => {
    return [...new Set(users.map((user) => user.company?.department).filter(Boolean))].sort()
  }, [users])

  const filteredUsers = useMemo(() => {
    const term = filters.searchTerm.trim().toLowerCase()

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

      const matchesGender = filters.genderFilter === 'all' || user.gender === filters.genderFilter
      const matchesCountry =
        filters.countryFilter === 'all' || userCountry === filters.countryFilter
      const matchesDepartment =
        filters.departmentFilter === 'all' || userDepartment === filters.departmentFilter

      return matchesSearch && matchesGender && matchesCountry && matchesDepartment
    })
  }, [filters, users])

  const sortedUsers = useMemo(() => {
    const clone = [...filteredUsers]

    clone.sort((a, b) => {
      if (filters.sortBy === 'name-asc') {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      }
      if (filters.sortBy === 'name-desc') {
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`)
      }
      if (filters.sortBy === 'age-asc') {
        return a.age - b.age
      }
      if (filters.sortBy === 'age-desc') {
        return b.age - a.age
      }
      return a.id - b.id
    })

    return clone
  }, [filteredUsers, filters.sortBy])

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

  return {
    countries,
    departments,
    filteredUsers,
    sortedUsers,
    totalPages,
    activePage,
    pageUsers,
    averageAge,
    uniqueCountries,
    mostCommonDepartment,
  }
}

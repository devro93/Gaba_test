export type User = {
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

export type UsersResponse = {
  users: User[]
}

export type FilterState = {
  searchTerm: string
  genderFilter: string
  countryFilter: string
  departmentFilter: string
  sortBy: string
}

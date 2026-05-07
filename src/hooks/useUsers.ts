import { useEffect, useState } from 'react'
import type { User, UsersResponse } from '../types'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return { users, loading, error }
}

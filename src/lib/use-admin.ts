"use client"

import { useState, useEffect, useCallback } from "react"

/** 通用 CRUD hook */
export function useCrud<T extends { id: string }>(apiPath: string) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const res = await fetch(apiPath)
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }, [apiPath])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const create = async (data: Partial<T>) => {
    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const created = await res.json()
    setItems((prev) => [created, ...prev])
    return created
  }

  const update = async (id: string, data: Partial<T>) => {
    const res = await fetch(`${apiPath}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const updated = await res.json()
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }

  const remove = async (id: string) => {
    await fetch(`${apiPath}/${id}`, { method: "DELETE" })
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return { items, loading, create, update, remove, refetch: fetchAll }
}

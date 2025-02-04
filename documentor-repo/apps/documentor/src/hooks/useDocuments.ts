//
//  useDocuments.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { useMutation, useQuery } from '@tanstack/react-query'
import { BASE_URL } from '../lib/api'
import { currentDocumentAtom } from '../stores/documents.stores'
import { userIdAtom } from '../stores/auth.stores'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { queryClient } from '../lib/api'

export function useDocuments() {

  interface DocumentTypes {
    title: string,
    content: object,
    userId: string
  }

  const [userId] = useAtom(userIdAtom)
  const [selectedDocument, setSelectedDocument] = useAtom(currentDocumentAtom)

  // Fetch documents query
  const documentsQuery = useQuery({
    queryKey: ['documents', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not logged in')
      const response = await fetch(`${BASE_URL}/documents/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch documents')

      const data = await response.json() // Resolved value
      // console.log('Fetched documents:', data) // Debugging line
      return data
    },
    enabled: !!userId
  })

  // Fetch document query
  const fetchDocumentQuery = useQuery({
    queryKey: ['document', selectedDocument?._id],
    queryFn: async () => {
      if (!selectedDocument?._id) return null
      const response = await fetch(`${BASE_URL}/documents/${selectedDocument?._id}`)
      if (!response.ok) throw new Error('Failed to fetch selected document')
      return response.json()
    },
    enabled: !!selectedDocument?._id
  })

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async ({ title, content, userId }: DocumentTypes) => {
      const response = await fetch(`${BASE_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, userId }),
      })
      // console.log(userId)

      if (!response.ok) throw new Error('Failed to create document')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch to get the proper updated order
      queryClient.invalidateQueries({ queryKey: ['docuuments', userId] })
    }
  })

  //Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async ({ id, title, content }: {
      id: string,
      title: string,
      content: object
    }) => {
      const response = await fetch(`${BASE_URL}/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) throw new Error('Failed to update document')
      return response.json()
    },
  })

  // Reorder mutation
  const reorderDocumentsMutation = useMutation({
    mutationFn: async (updates: { id: string, order: number }[]) => {
      const response = await fetch(`${BASE_URL}/documents/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      })

      if (!response) throw new Error('Failed to reorder the documents array')
      return response.json()
    }
  })

  // Invalidate and refetch documents after creating a new document
  useEffect(() => {
    if (createDocumentMutation.isSuccess) {
      documentsQuery.refetch() // Refetch the documents list
    }
  }, [createDocumentMutation.isSuccess, documentsQuery])

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`${BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch documents query
      queryClient.invalidateQueries({
        queryKey: ['documents', userId]
      })
    },
    onError: (error: Error) => {
      console.error('Delete error:', error.message)
      // You can add toast notifications here
    }
  })

  // Invalidate and refetch documents after deleting a document
  useEffect(() => {
    if (deleteDocumentMutation.isSuccess) {
      documentsQuery.refetch() // Refetch the documents list
    }
  }, [deleteDocumentMutation.isSuccess, documentsQuery])

  return {
    documentsQuery,
    createDocumentMutation,
    updateDocumentMutation,
    reorderDocumentsMutation,
    deleteDocumentMutation,
    setSelectedDocument,
    fetchDocumentQuery
  }
}
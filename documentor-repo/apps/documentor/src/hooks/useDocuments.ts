//
//  useDocuments.ts
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { useMutation, useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../lib/api';
import { documentsAtom, currentDocumentAtom } from '../stores/documents.stores';
import { userIdAtom } from '../stores/auth.stores'
import { useEffect } from 'react';
import { useAtom } from 'jotai';

export function useDocuments() {

  interface DocumentTypes {
    title: string,
    content: object[],
    userId: string
  }

  const [userId] = useAtom(userIdAtom);
  // const [documents, setDocuments] = useAtom(documentsAtom);
  const [selectedDocument, setSelectedDocument] = useAtom(currentDocumentAtom);

  // Fetch documents query
  const documentsQuery = useQuery({
    queryKey: ['documents', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not logged in')
      console.log('userId:', userId); // Debugging line
      const response = await fetch(`${BASE_URL}/documents/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch documents');

      const data = await response.json() // Resolved value
      console.log('Fetched documents:', data); // Debugging line
      return data;
    },
    enabled: !!userId
  });

  // Update documents state when the query succeeds
  // useEffect(() => {
  //   if (documentsQuery.data) {
  //     setDocuments(documentsQuery.data);
  //   }
  // }, [documentsQuery.data, setDocuments]);

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async ({ title, content, userId }: DocumentTypes) => {
      const response = await fetch(`${BASE_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, userId }),
      });
      if (!response.ok) throw new Error('Failed to create document');
      return response.json();
    },
  });

  // Invalidate and refetch documents after creating a new document
  useEffect(() => {
    if (createDocumentMutation.isSuccess) {
      documentsQuery.refetch(); // Refetch the documents list
    }
  }, [createDocumentMutation.isSuccess, documentsQuery]);

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId) => {
      const response = await fetch(`${BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      return response.json();
    },
  });

  // Invalidate and refetch documents after deleting a document
  useEffect(() => {
    if (deleteDocumentMutation.isSuccess) {
      documentsQuery.refetch(); // Refetch the documents list
    }
  }, [deleteDocumentMutation.isSuccess, documentsQuery]);

  return {
    documentsQuery,
    createDocumentMutation,
    deleteDocumentMutation,
    selectedDocument,
    setSelectedDocument,
  };
}
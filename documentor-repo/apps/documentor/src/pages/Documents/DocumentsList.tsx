//
//  DocumentsList.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import { Document } from '../../stores/documents.stores';
import {
  Card,
  Title,
  Button,
  Group,
  Container,
  Center,
  Text,
} from '@mantine/core';
import { useAtom } from 'jotai';
import { userIdAtom } from '../../stores/auth.stores';
import { SelectAndMove } from './DocumentsSelecto';
import clsx from 'clsx';
import classes from '../pages.module.css';

// Memoized component for the "Create Document" button
const CreateDocumentButton = React.memo(() => (
  <Group justify="center">
    <Button component={Link} radius="md" to="/documents/new">
      Create Document
    </Button>
  </Group>
));

// Memoized component for displaying a message when no documents are found
const NoDocumentsMessage = React.memo(() => (
  <Center mt="xl">
    <Text>
      No documents found. Press{' '}
      <span className={clsx(classes.color_blue)}>'Create Document'</span> to
      create a new Document.
    </Text>
  </Center>
));

// Memoized component for rendering individual document cards
const DocumentCard = React.memo(
  ({
    doc,
    onDelete,
    onEdit,
  }: {
    doc: Document;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
  }) => (
    <Card
      key={doc._id}
      shadow="sm"
      p="lg"
      mb="xs"
      radius="lg"
      className={clsx('selectable')}
      style={{
        position: 'relative',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <Group justify="space-between">
        <Title order={3} lineClamp={1} maw={'60%'}>
          <Text
            size="sm"
            style={{
              position: 'absolute',
              top: 7,
              left: 20,
              fontWeight: 200,
              opacity: 0.3,
            }}
          >
            Order: {doc.order}
          </Text>
          {doc.title}
        </Title>
        <Group gap="xs">
          <Button radius="md" color="yellow" onClick={() => onEdit(doc._id)}>
            Edit
          </Button>
          <Button radius="md" color="red" onClick={() => onDelete(doc._id)}>
            Delete
          </Button>
        </Group>
      </Group>
    </Card>
  )
);

export function DocumentsList() {
  const {
    // prettier-ignore
    documentsQuery,
    deleteDocumentMutation,
    reorderDocumentsMutation,
  } = useDocuments();
  const navigate = useNavigate();
  const [userId] = useAtom(userIdAtom);
  const [documentsData, setDocumentsData] = useState<Document[]>([]);

  // Sort documents when data changes
  useMemo(() => {
    if (documentsQuery.data) {
      const sortedDocs = [...documentsQuery.data].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      setDocumentsData(sortedDocs);
    }
  }, [documentsQuery.data]);

  // Handle reordering of documents
  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setDocumentsData((prevData) => {
        const newOrder = [...prevData];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);

        const startIdx = Math.min(fromIndex, toIndex);
        const endIdx = Math.max(fromIndex, toIndex);
        const updates = newOrder
          .slice(startIdx, endIdx + 1)
          .map((doc, index) => ({
            id: doc._id,
            order: startIdx + index,
          }));

        reorderDocumentsMutation.mutate(updates, {
          onSuccess: () => newOrder,
          onError: () => prevData,
        });

        return newOrder;
      });

      // Refetch documents after a short delay
      setTimeout(() => {
        documentsQuery.refetch();
      }, 500);
    },
    [reorderDocumentsMutation, documentsQuery]
  );

  // Handle document deletion
  const handleDelete = useCallback(
    (documentId: string) => {
      if (!userId) {
        console.error('User not logged in');
        return;
      }
      deleteDocumentMutation.mutate(documentId);
    },
    [userId, deleteDocumentMutation]
  );

  // Handle document editing (navigation)
  const handleEdit = useCallback(
    (documentId: string) => {
      navigate(`/documents/${documentId}/edit`);
    },
    [navigate]
  );

  // Show loading or error states
  if (documentsQuery.isLoading) return <Center>Loading...</Center>;
  if (documentsQuery.error) return <Center>Error loading documents</Center>;

  return (
    <Container p={'100px'}>
      <CreateDocumentButton />
      {documentsData.length === 0 ? (
        <NoDocumentsMessage />
      ) : (
        <SelectAndMove onReorder={handleReorder}>
          {documentsData.map((doc: Document) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </SelectAndMove>
      )}
    </Container>
  );
}

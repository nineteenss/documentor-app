//
//  DocumentsList.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { useDocuments } from '../../hooks/useDocuments';
import { Card, Title, Button, Group, Center } from '@mantine/core';
import { Link } from 'react-router-dom';

export function DocumentsList() {
  const { documentsQuery } = useDocuments();

  console.log('documentsQuery:', documentsQuery); //debug
  console.log('documentsQuery.data:', documentsQuery.data); //debug
  const documentsData = documentsQuery.data || [];
  console.log('documentsData:', documentsData); //debug

  if (documentsQuery.isLoading) return <div>Loading...</div>;
  if (documentsQuery.error) return <div>Error loading documents</div>;

  return (
    <Center>
      <div>
        <Group mb="md">
          <Title>Documents</Title>
          <Button component={Link} to="/documents/new">
            Create Document
          </Button>
        </Group>
        {documentsData.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          documentsData.map((doc) => (
            <Card key={doc._id} shadow="sm" p="lg" mb="sm">
              <Title order={3}>{doc.documentTitle}</Title>
              <Button
                component={Link}
                to={`/documents/${doc._id}/edit`}
                mt="sm"
              >
                Edit
              </Button>
            </Card>
          ))
        )}
      </div>
    </Center>
  );
}

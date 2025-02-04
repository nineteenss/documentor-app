//
//  DocumentsList.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { useDocuments } from '../../hooks/useDocuments';
import {
  Card,
  Title,
  Button,
  Group,
  Center,
  Container,
  Grid,
} from '@mantine/core';
import { Link } from 'react-router-dom';

export function DocumentsList() {
  const { documentsQuery } = useDocuments();

  // console.log('documentsQuery:', documentsQuery); //debug
  // console.log('documentsQuery.data:', documentsQuery.data); //debug
  const documentsData = documentsQuery.data || [];
  // console.log('documentsData:', documentsData); //debug

  if (documentsQuery.isLoading) return <div>Loading...</div>;
  if (documentsQuery.error) return <div>Error loading documents</div>;

  return (
    <Container p={'100px'}>
      <Group mb="md" justify="center">
        <Button component={Link} radius="md" to="/documents/new">
          Create Document
        </Button>
      </Group>
      {documentsData.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        documentsData.map((doc) => (
          <Card key={doc._id} shadow="sm" p="lg" mb="sm">
            <Group justify="space-between">
              <Title order={3}>{doc.title}</Title>
              <Button
                component={Link}
                radius="md"
                to={`/documents/${doc._id}/edit`}
              >
                Edit
              </Button>
            </Group>
          </Card>
        ))
      )}
    </Container>
  );
}

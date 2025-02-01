//
//  DocumentsList.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button, List, Text } from '@mantine/core';
// import { useAtom } from 'jotai';
// import { documentsAtom } from '../../stores/documents.stores';
// import { useEffect } from 'react';

const DocumentsList = () => {
  const navigate = useNavigate();
  // const queryClient = useQueryClient();
  // const [documents, setDocuments] = useAtom(documentsAtom);

  // Fetch documents
  const {
    data: documents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await fetch('/documents');
      console.log('documents response:', response);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
  });

  // Update Jotai state when data changes
  // useEffect(() => {
  //   if (data) setDocuments(data);
  // }, [data, setDocuments]);

  // Delete mutation
  // const deleteMutation = useMutation({
  //   mutationFn: async (id: string) => {
  //     const response = await fetch(`/documents/${id}`, { method: 'DELETE' });
  //     if (!response.ok) throw new Error('Failed to delete document');
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['documents'] });
  //   },
  // });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching documents</Text>;

  return (
    <div>
      <Button onClick={() => navigate('/documents/new')}>
        Create Document
      </Button>
      <List>
        {documents?.map((doc: any) => (
          <List.Item key={doc._id}>
            <Text onClick={() => navigate(`/documents/${doc._id}`)}>
              {doc.title}
            </Text>
            {/* <Button onClick={() => deleteMutation.mutate(doc._id)}>
              Delete
            </Button> */}
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default DocumentsList;

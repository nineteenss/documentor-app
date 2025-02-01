//
//  DocumentEditor.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Button, TextInput, Group, Title } from '@mantine/core';
import { useDocuments } from '../../hooks/useDocuments';
// import { useUserId } from '../../hooks/useAuth';
import { RichTextEditor } from '../../components/RichTextEditor';
import { titleAtom, contentAtom } from '../../stores/documents.stores';
import { userIdAtom } from '../../stores/auth.stores';
import { BASE_URL } from '../../lib/api';

export function DocumentEditor() {
  const [userId] = useAtom(userIdAtom);
  const { id } = useParams();
  const navigate = useNavigate();
  const { createDocumentMutation, setSelectedDocument, selectedDocument } =
    useDocuments();
  const [title, setTitle] = useAtom(titleAtom);
  const [content, setContent] = useAtom(contentAtom);

  useEffect(() => {
    if (id && !selectedDocument) {
      // Fetch document by ID (you can add this logic to `useDocuments`)
      const fetchDocument = async () => {
        const response = await fetch(`${BASE_URL}/documents/${id}`);
        const document = await response.json();
        setTitle(document.documentTitle);
        setContent(document.documentContent);
        setSelectedDocument(document);
      };
      fetchDocument();
    }
  }, [id]);

  // Reset state when navigating away
  useEffect(() => {
    if (!id) {
      setTitle('');
      setContent({});
      setSelectedDocument(null);
    }
  }, [id]);

  const handleSave = () => {
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    createDocumentMutation.mutate(
      { title, content, userId },
      { onSuccess: () => navigate('/documents') }
    );
  };

  return (
    <div>
      <Title>{id ? 'Edit Document' : 'New Document'}</Title>
      <TextInput placeholder="Title" mb="md" />
      <RichTextEditor />
      <Group mt="md">
        <Button onClick={handleSave}>Save Document</Button>
      </Group>
    </div>
  );
}

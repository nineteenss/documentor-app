//
//  DocumentEditor.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  TextInput,
  Group,
  Title,
  Container,
  Center,
} from '@mantine/core';
import { useDocuments } from '../../hooks/useDocuments';
import { RichTextEditor } from '../../components/RichTextEditor';
import { BASE_URL } from '../../lib/api';
import { userIdAtom } from '../../stores/auth.stores';
import { useAtom } from 'jotai';
import { JSONContent } from '@tiptap/react';

export function DocumentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<JSONContent>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useAtom(userIdAtom);

  const { createDocumentMutation, updateDocumentMutation } = useDocuments();

  useEffect(() => {
    if (id) {
      const fetchDocument = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/documents/${id}`);
          if (!response.ok) throw new Error('Failed to fetch document');
          const document = await response.json();

          setTitle(document.title);
          setContent(document.content);
        } catch (error) {
          console.error('Error fetching document:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDocument();
    } else {
      setTitle('');
      setContent({});
    }
  }, [id]);

  const handleSave = () => {
    const documentData = { title, content };

    if (!userId) {
      console.error('User not logged in');
      return;
    }

    if (id) {
      updateDocumentMutation.mutate(
        { id, ...documentData },
        { onSuccess: () => navigate('/documents') }
      );
    } else {
      createDocumentMutation.mutate(
        { title, content, userId },
        { onSuccess: () => navigate('/documents') }
      );
    }
  };

  // Gonna replace with loader if needed
  // if (isLoading) return <div>Loading document...</div>;

  return (
    <Container p={'100px'}>
      <div>
        <Center>
          <Title mb="md">{id ? 'Edit Document' : 'New Document'}</Title>
        </Center>
        <TextInput
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb="md"
        />
        <RichTextEditor
          key={id || 'new'} // Force remount on document change
          content={content}
          onContentChange={setContent}
        />
        <Group mt="md">
          <Button radius="md" onClick={handleSave}>
            {id ? 'Update Document' : 'Create Document'}
          </Button>
        </Group>
      </div>
    </Container>
  );
}

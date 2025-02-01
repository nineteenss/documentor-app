//
//  DocumentEditor.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 01.02.2025
//

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, TextInput } from '@mantine/core';
import { atom, useAtom } from 'jotai';
import { currentDocumentAtom } from '../../stores/documents.stores';
import { userAtom } from '../../stores/auth.stores';

const titleAtom = atom('');

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useAtom(titleAtom);
  const [, setCurrentDocument] = useAtom(currentDocumentAtom);
  const [user] = useAtom(userAtom);

  // Setup Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing...</p>',
  });

  // Fetch document data
  const { data: document } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const response = await fetch(`/documents/${id}`);
      if (!response.ok) throw new Error('Failed to fetch document');
      return response.json();
    },
    enabled: !!id,
  });

  // Update state when document data changes
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      editor?.commands.setContent(document.content);
      setCurrentDocument(document);
    }
  }, [document, editor, setCurrentDocument, setTitle]); //setTitle

  // Save document mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const url = id ? `/documents/${id}` : '/documents';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: editor?.getJSON(),
          userId: user?._id,
        }),
      });
      if (!response.ok) throw new Error('Failed to save document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      navigate('/documents');
    },
  });

  return (
    <div>
      <TextInput
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb="md"
      />
      <EditorContent editor={editor} />
      <Button mt="md" onClick={() => saveMutation.mutate()}>
        Save Document
      </Button>
    </div>
  );
};

export default DocumentEditor;

//
//  RichTextEditor.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { JSONContent } from '@tiptap/core';

// Default empty document structure
const DEFAULT_CONTENT: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};

interface TextEditorTypes {
  content: JSONContent;
  onContentChange: (newContent: JSONContent) => void;
}

export function RichTextEditor({ content, onContentChange }: TextEditorTypes) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: DEFAULT_CONTENT, // content
  });

  // Handle initial content and external changes
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentContent = editor.getJSON();

      // Use default content if empty, otherwise use provided content
      const newContent = content?.content?.length ? content : DEFAULT_CONTENT;

      // Only update if content is different
      if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
        editor.commands.setContent(newContent);
      }
    }
  }, [content, editor]);

  // Handle local editor updates
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = ({ editor }) => {
      const newContent = editor.getJSON();

      // Only propagate changes if content is different
      if (JSON.stringify(newContent) !== JSON.stringify(content)) {
        onContentChange(newContent);
      }
    };

    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, onContentChange, content]);

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}

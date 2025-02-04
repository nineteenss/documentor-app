//
//  RichTextEditor.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { useEffect } from 'react';
import {
  useEditor,
  // EditorContent,
  EditorEvents,
  // FloatingMenu,
} from '@tiptap/react';
import '@mantine/tiptap/styles.css';
import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap';
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

    // Specified the type of the listener to 'EditorEvents['update']'
    const handleUpdate = ({ editor }: EditorEvents['update']) => {
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
      <MantineRichTextEditor editor={editor}>
        <MantineRichTextEditor.Toolbar>
          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Bold />
            <MantineRichTextEditor.Italic />
            <MantineRichTextEditor.Underline />
            <MantineRichTextEditor.Strikethrough />
            <MantineRichTextEditor.ClearFormatting />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.H1 />
            <MantineRichTextEditor.H2 />
            <MantineRichTextEditor.H3 />
            <MantineRichTextEditor.H4 />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Blockquote />
            <MantineRichTextEditor.Hr />
            <MantineRichTextEditor.BulletList />
            <MantineRichTextEditor.OrderedList />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Link />
            <MantineRichTextEditor.Unlink />
          </MantineRichTextEditor.ControlsGroup>
        </MantineRichTextEditor.Toolbar>

        <MantineRichTextEditor.Content />
      </MantineRichTextEditor>
    </div>
  );
}

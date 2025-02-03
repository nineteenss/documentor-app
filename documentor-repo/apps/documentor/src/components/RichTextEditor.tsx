//
//  RichTextEditor.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { useEffect } from 'react';
import { useEditor, EditorContent, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TextEditorTypes {
  content: object;
  onContentChange: (newContent: object) => void; // Callback to handle content updates
}

export function RichTextEditor({ content, onContentChange }: TextEditorTypes) {
  // Editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content,
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Handle editor updates
  useEffect(() => {
    if (!editor) return;

    editor.on('update', ({ editor }) => {
      const newContent = editor.getJSON();
      onContentChange(newContent);
    });
  }, [editor, onContentChange]);

  return (
    <div>
      <EditorContent editor={editor} />
      {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu> */}
    </div>
  );
}

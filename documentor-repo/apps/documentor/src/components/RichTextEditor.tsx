//
//  RichTextEditor.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 02.02.2025
//

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TextEditorTypes {
  content: object;
  onContentChange: (newContent: object) => void; // Callback to handle content updates
}

export function RichTextEditor({ content, onContentChange }: TextEditorTypes) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getJSON()); // Emit the updated content
    },
  });

  return <EditorContent editor={editor} />;
}

// export default RichTextEditor;

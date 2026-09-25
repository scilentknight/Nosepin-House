"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  Link,
  List,
  Image,
  ImageInsertViaUrl,
  ImageToolbar,
  ImageStyle,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

interface CKEditorFieldProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function CKEditorField({ value, onChange, placeholder }: CKEditorFieldProps) {
  return (
    <div className="ck-content-wrapper rounded-lg border border-gray-200 bg-white [&_.ck.ck-editor__editable]:min-h-[160px] [&_.ck.ck-editor__editable]:px-3 [&_.ck.ck-editor__editable]:py-2 [&_.ck.ck-toolbar]:rounded-t-lg [&_.ck.ck-toolbar]:border-0 [&_.ck.ck-toolbar]:border-b [&_.ck.ck-toolbar]:border-gray-100 [&_.ck.ck-toolbar]:bg-gray-50 [&_.ck.ck-content]:rounded-b-lg [&_.ck.ck-editor__editable]:border-0 [&_.ck.ck-editor__editable]:shadow-none">
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={{
          licenseKey: "GPL",
          plugins: [Essentials, Paragraph, Bold, Italic, Heading, Link, List, Image, ImageInsertViaUrl, ImageToolbar, ImageStyle],
          toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "insertImageViaUrl"],
          image: {
            toolbar: ["imageStyle:inline", "imageStyle:block", "imageStyle:side"],
          },
          placeholder,
        }}
        onChange={(_event, editor) => onChange(editor.getData())}
      />
    </div>
  );
}

import { Bold, Italic, ImageIcon, List, ListOrdered } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useCallback, useRef, ChangeEvent, useEffect, useState } from "react";
import { useUploadFile } from "@/react-query-hooks/hooks/use-uploads3";
import ImageViewer from "./image-viewer";

export const TiptapEditor = ({
  value,
  onChange,
  placeholder = "Enter your question description...",
}: {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(
    new Set()
  );
  const [viewerImage, setViewerImage] = useState({
    isOpen: false,
    url: "",
    alt: "",
  });

  const uploadMutation = useUploadFile("question", "", {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png"],
    allowedExtensions: ["jpg", "jpeg", "png"],
  });

  const handleUpload = useCallback(
    async (file: File) => {
      let res = { error: false, message: "", url: "" };
      try {
        const fileURL = await uploadMutation.mutateAsync({
          file,
          onProgress: () => {},
        });
        res = {
          url: fileURL,
          error: false,
          message: "Image uploaded successfully",
        };
      } catch (error: unknown) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error
        ) {
          errorMessage = (error as { message: string }).message;
          return { error: true, message: errorMessage, url: "" };
        }
      } finally {
        return res;
      }
    },
    [uploadMutation]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "question-image rounded-lg cursor-pointer hover:opacity-90 transition-opacity",
          style: "width: 200px; height: 150px; object-fit: cover; display: inline-block; margin: 0.5rem; vertical-align: top;",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  const handleImageUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      // Validate file
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }

      const uploadId = `upload_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const loadingSrc = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjOTk5IiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4K#${uploadId}`;
      try {
        // Show loading state
        // Track this upload
        setUploadingImages((prev) => new Set(prev).add(uploadId));

        // Replace loading image with actual image
        editor
          .chain()
          .focus()
          .command(({ tr, dispatch }) => {
            if (dispatch) {
              // Insert the loading image inline
            const imageNode = tr.doc.type.schema.nodes.image.create({
              src: loadingSrc,
              alt: "Uploading...",
            });
            tr.insert(tr.selection.to, imageNode);
            }
            return true;
          })
          .run();
          console.log("Uploading image:", uploadId, file.name);

        // Upload to S3
        const result = await handleUpload(file);

        if (result.error) {
          throw new Error(result.message);
        }

        // Replace the specific loading image with the actual image
        editor.view.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image' && node.attrs.src === loadingSrc) {
            const transaction = editor.view.state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              src: result.url,
              alt: file.name,
            });
            editor.view.dispatch(transaction);
            return false; // Stop after finding the first match
          }
        });
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image");
        
        // Remove the loading image on error
        editor.view.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image' && node.attrs.src === loadingSrc) {
            const transaction = editor.view.state.tr.delete(pos, pos + node.nodeSize);
            editor.view.dispatch(transaction);
            return false;
          }
        });

      } finally {
        // Clean up tracking
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(uploadId);
          return newSet;
        });
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [editor, handleUpload]
  );
  // Handle image clicks to open viewer
  const handleEditorClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.tagName === "IMG" &&
      target.classList.contains("question-image")
    ) {
      event.preventDefault();
      setViewerImage({
        isOpen: true,
        url: (target as HTMLImageElement).src,
        alt: (target as HTMLImageElement).alt,
      });
    }
  }, []);

  // Close viewer on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && viewerImage.isOpen) {
        setViewerImage((prev) => ({ ...prev, isOpen: false }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [viewerImage.isOpen]);

  if (!editor) return null;

  return (
    <>
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("italic") ? "bg-gray-300" : ""
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bulletList") ? "bg-gray-300" : ""
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("orderedList") ? "bg-gray-300" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded hover:bg-gray-200"
            title="Upload Image"
            disabled={uploadingImages.size > 0}
          >
            <ImageIcon size={16} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Editor */}
        <div className="min-h-[200px]" onClick={handleEditorClick}>
          <EditorContent editor={editor} placeholder={placeholder} />
        </div>
      </div>
      <ImageViewer
        isOpen={viewerImage.isOpen}
        imageUrl={viewerImage.url}
        imageAlt={viewerImage.alt}
        onClose={() => setViewerImage((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

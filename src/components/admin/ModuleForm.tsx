"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2 } from "lucide-react";
import { ModuleWithStats } from "@/types";

interface ModuleFormProps {
  initialData?: ModuleWithStats | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ModuleForm({ initialData, onSuccess, onCancel }: ModuleFormProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [tags, setTags] = useState(
    initialData?.tags
      ? Array.isArray(initialData.tags)
        ? initialData.tags.join(", ")
        : JSON.parse(initialData.tags || "[]").join(", ")
      : ""
  );
  const [level, setLevel] = useState(initialData?.level || "BEGINNER");

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.description || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none min-h-[150px] p-3"
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const description = editor?.getHTML() || "";
    const tagsArray = tags.split(",").map((t: string) => t.trim()).filter(Boolean);

    const payload = {
      title,
      description,
      tags: tagsArray,
      level
    };

    try {
      const url = initialData ? `/api/modules/${initialData.id}` : "/api/modules";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save module");

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error saving module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Judul Materi</Label>
        <Input
          id="title"
          placeholder="Contoh: Pengenalan JSX"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Pemisah koma)</Label>
        <Input
          id="tags"
          placeholder="Contoh: Frontend, React, Web"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Level Kesulitan</Label>
        <select
          id="level"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={level}
          onChange={(e) => setLevel(e.target.value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Isi Materi (Rich Text)</Label>
        <div className="border rounded-md toolbar-container bg-white p-2 flex gap-2 flex-wrap mb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive("bold") ? "bg-slate-200" : ""}
          >
            B
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive("italic") ? "bg-slate-200" : ""}
          >
            I
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor?.isActive("heading", { level: 2 }) ? "bg-slate-200" : ""}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive("bulletList") ? "bg-slate-200" : ""}
          >
            List
          </Button>
        </div>
        <EditorContent editor={editor} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading || !editor}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Simpan
        </Button>
      </div>
    </form>
  );
}

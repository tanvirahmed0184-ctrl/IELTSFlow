"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload, FileText, CheckCircle2, AlertTriangle, Loader2, Trash2,
  Database, Tag, BookOpen, X, File, Sparkles,
} from "lucide-react";

interface UploadResult {
  success: boolean;
  resourceId: string | null;
  fileName: string;
  extractedTextLength: number;
  totalChunks: number;
  chunksWithEmbeddings: number;
  preview: string;
}

const SOURCE_TYPES = [
  { value: "READING_PASSAGE", label: "Reading Passage" },
  { value: "WRITING_PROMPT", label: "Writing Prompt" },
  { value: "SAMPLE_ANSWER", label: "Sample Answer" },
  { value: "CUE_CARD", label: "Speaking Cue Card" },
  { value: "LESSON_NOTES", label: "Lesson Notes" },
  { value: "VOCABULARY_LIST", label: "Vocabulary List" },
  { value: "LISTENING_SCRIPT", label: "Listening Script" },
  { value: "GENERAL_MATERIAL", label: "General Material" },
];

const MODULES = [
  { value: "", label: "All Modules" },
  { value: "LISTENING", label: "Listening" },
  { value: "READING", label: "Reading" },
  { value: "WRITING", label: "Writing" },
  { value: "SPEAKING", label: "Speaking" },
];

const DIFFICULTIES = [
  { value: "", label: "Not specified" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

interface UploadedFile {
  id: string;
  file: File;
  title: string;
  module: string;
  sourceType: string;
  topic: string;
  difficulty: string;
  variant: string;
  status: "pending" | "uploading" | "processing" | "done" | "error";
  result?: UploadResult;
  error?: string;
}

export default function AdminResourcesPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      file,
      title: file.name.replace(/\.[^.]+$/, ""),
      module: "",
      sourceType: "GENERAL_MATERIAL",
      topic: "",
      difficulty: "",
      variant: "ACADEMIC",
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const updateFile = useCallback((id: string, updates: Partial<UploadedFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const uploadFile = useCallback(async (uf: UploadedFile) => {
    updateFile(uf.id, { status: "uploading" });

    const formData = new FormData();
    formData.append("file", uf.file);
    formData.append("title", uf.title);
    formData.append("sourceType", uf.sourceType);
    if (uf.module) formData.append("module", uf.module);
    if (uf.topic) formData.append("topic", uf.topic);
    if (uf.difficulty) formData.append("difficulty", uf.difficulty);
    if (uf.variant) formData.append("variant", uf.variant);

    updateFile(uf.id, { status: "processing" });

    try {
      const res = await fetch("/api/resources/upload", { method: "POST", body: formData });
      const text = await res.text();
      let data: { success?: boolean; error?: string } & UploadResult;
      try {
        data = JSON.parse(text);
      } catch {
        updateFile(uf.id, { status: "error", error: res.ok ? "Invalid response" : `Server error (${res.status})` });
        return;
      }
      if (res.ok && data.success) {
        updateFile(uf.id, { status: "done", result: data });
      } else {
        updateFile(uf.id, { status: "error", error: data.error ?? "Upload failed" });
      }
    } catch (err) {
      updateFile(uf.id, { status: "error", error: err instanceof Error ? err.message : "Network error" });
    }
  }, [updateFile]);

  const uploadAll = useCallback(async () => {
    const pending = files.filter((f) => f.status === "pending");
    for (const f of pending) {
      await uploadFile(f);
    }
  }, [files, uploadFile]);

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const totalChunks = files.reduce((sum, f) => sum + (f.result?.totalChunks ?? 0), 0);
  const totalEmbeddings = files.reduce((sum, f) => sum + (f.result?.chunksWithEmbeddings ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resource Management</h1>
          <p className="text-muted-foreground mt-1">Upload IELTS materials for AI-powered content generation.</p>
        </div>
        {pendingCount > 0 && (
          <button onClick={uploadAll}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-purple-dark">
            <Upload className="h-4 w-4" /> Upload All ({pendingCount})
          </button>
        )}
      </div>

      {/* Stats */}
      {doneCount > 0 && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Files Processed</div>
            <div className="mt-1 text-2xl font-extrabold text-green-600">{doneCount}</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Chunks</div>
            <div className="mt-1 text-2xl font-extrabold">{totalChunks}</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Embeddings Created</div>
            <div className="mt-1 text-2xl font-extrabold text-brand-purple">{totalEmbeddings}</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vector DB Status</div>
            <div className="mt-1 text-sm font-semibold flex items-center gap-1.5">
              <Database className="h-4 w-4 text-brand-teal" /> Ready for RAG
            </div>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver ? "border-brand-purple bg-brand-purple/5" : "border-muted-foreground/25 hover:border-brand-purple/50 hover:bg-muted/50"
        }`}
      >
        <Upload className={`mx-auto h-10 w-10 mb-3 ${dragOver ? "text-brand-purple" : "text-muted-foreground/50"}`} />
        <p className="text-sm font-medium">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Supports PDF, TXT, DOCX, CSV (max 10MB)</p>
        <input ref={fileInputRef} type="file" className="hidden" multiple accept=".pdf,.txt,.docx,.csv"
          onChange={(e) => e.target.files && addFiles(e.target.files)} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((uf) => (
            <div key={uf.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <File className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <input value={uf.title} onChange={(e) => updateFile(uf.id, { title: e.target.value })}
                    className="text-sm font-semibold bg-transparent outline-none w-full" placeholder="Resource title" />
                  <div className="text-xs text-muted-foreground">{uf.file.name} — {(uf.file.size / 1024).toFixed(0)} KB</div>
                </div>
                <div className="flex items-center gap-2">
                  {uf.status === "pending" && (
                    <button onClick={() => uploadFile(uf)} className="rounded-lg bg-brand-teal px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-teal-dark">
                      <Upload className="h-3.5 w-3.5 inline mr-1" />Process
                    </button>
                  )}
                  {(uf.status === "uploading" || uf.status === "processing") && (
                    <span className="flex items-center gap-1.5 text-xs text-brand-purple font-medium">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {uf.status === "uploading" ? "Uploading..." : "Extracting & embedding..."}
                    </span>
                  )}
                  {uf.status === "done" && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Done
                    </span>
                  )}
                  {uf.status === "error" && (
                    <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" /> {uf.error}
                    </span>
                  )}
                  <button onClick={() => removeFile(uf.id)} className="text-muted-foreground hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Metadata row */}
              {uf.status === "pending" && (
                <div className="flex flex-wrap gap-3 border-t bg-muted/30 px-5 py-3">
                  <select value={uf.sourceType} onChange={(e) => updateFile(uf.id, { sourceType: e.target.value })}
                    className="rounded-md border bg-background px-2 py-1.5 text-xs">
                    {SOURCE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <select value={uf.module} onChange={(e) => updateFile(uf.id, { module: e.target.value })}
                    className="rounded-md border bg-background px-2 py-1.5 text-xs">
                    {MODULES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select value={uf.difficulty} onChange={(e) => updateFile(uf.id, { difficulty: e.target.value })}
                    className="rounded-md border bg-background px-2 py-1.5 text-xs">
                    {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                  <input value={uf.topic} onChange={(e) => updateFile(uf.id, { topic: e.target.value })}
                    placeholder="Topic (e.g. Environment)" className="rounded-md border bg-background px-2 py-1.5 text-xs w-40" />
                </div>
              )}

              {/* Result preview */}
              {uf.result && (
                <div className="border-t bg-green-50 px-5 py-3 space-y-2">
                  <div className="flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {uf.result.extractedTextLength.toLocaleString()} chars extracted</span>
                    <span className="flex items-center gap-1"><Database className="h-3 w-3" /> {uf.result.totalChunks} chunks</span>
                    <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> {uf.result.chunksWithEmbeddings} embeddings</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{uf.result.preview}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RAG info */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/10 shrink-0">
            <Sparkles className="h-5 w-5 text-brand-purple" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">How RAG Content Generation Works</h3>
            <ol className="mt-2 space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
              <li>Upload your IELTS materials (PDFs, text files, etc.)</li>
              <li>System extracts text and splits it into chunks (~800 chars each)</li>
              <li>Each chunk is converted to a 768-dimension vector embedding via Gemini</li>
              <li>Embeddings are stored in Supabase pgvector for similarity search</li>
              <li>When generating new tests, AI retrieves relevant chunks as context</li>
              <li>Gemini generates original content inspired by (not copied from) your materials</li>
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">
              <strong>Hallucination protection:</strong> Each generation is audited with confidence scores, source chunk IDs, and admin review before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

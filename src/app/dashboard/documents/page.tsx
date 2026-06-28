"use client";

import React, { useState } from "react";
import { useProspectStore, DocumentFile } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import {
  Folder,
  FolderOpen,
  PlusCircle,
  Trash2,
  Download,
  UploadCloud,
  FileText,
  Search,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocumentsPage() {
  const { toast } = useToast();

  const workspaces = useProspectStore((state) => state.workspaces);
  const activeWorkspaceId = useProspectStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const files = activeWorkspace.files || [];

  const addFile = useProspectStore((state) => state.addFile);
  const deleteFile = useProspectStore((state) => state.deleteFile);

  const [selectedFolder, setSelectedFolder] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("1.5 MB");
  const [fileType, setFileType] = useState("pdf");
  const [fileFolder, setFileFolder] = useState("Audits");

  const folders = ["All", "Audits", "Client Files", "Screenshots", "Exports"];

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      addFile({
        name: fileName.endsWith(`.${fileType}`) ? fileName : `${fileName}.${fileType}`,
        size: fileSize,
        type: fileType,
        folder: fileFolder
      });

      toast({
        title: "File Uploaded Successfully 💾",
        description: `"${fileName}" saved in folder "${fileFolder}".`,
        variant: "success",
      });

      setFileName("");
      setFileSize("1.5 MB");
      setIsUploadOpen(false);
    }, 2000);
  };

  const handleDelete = (id: string, name: string) => {
    deleteFile(id);
    toast({
      title: "File Deleted",
      description: `"${name}" removed from document storage.`,
      variant: "danger",
    });
  };

  const handleDownload = (name: string) => {
    toast({
      title: "Downloading File",
      description: `Saving "${name}" locally.`,
      variant: "info",
    });
  };

  const filteredFiles = files
    .filter((f) => selectedFolder === "All" || f.folder === selectedFolder)
    .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Storage usage calculator
  const storageUsed = 2.4; // GB mock
  const storageLimit = 10; // GB limit

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Workspace File Manager
          </h1>
          <p className="text-xs text-gray-400">
            Upload custom target lists, download proposals, review AI screenshots, and check space usage
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} variant="primary" size="sm">
          <UploadCloud className="h-4 w-4 mr-1.5 shrink-0" /> Upload File
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* SIDEBAR FOLDERS PANEL (Span 1) */}
        <div className="space-y-6">
          {/* Virtual folders list */}
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <FolderOpen className="h-4 w-4 text-gray-400" /> Directories
            </h3>
            <div className="flex flex-col space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-hidden",
                    selectedFolder === folder
                      ? "bg-[#FCE7EB] text-[#D84B68]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {folder}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Space Usage indicator */}
          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-5 space-y-3 select-none">
            <span className="text-3xs font-bold text-gray-400 uppercase tracking-widest block">Cloud Space Limit</span>
            <div className="flex justify-between items-baseline font-bold">
              <span className="text-sm text-gray-800">{storageUsed} GB</span>
              <span className="text-3xs text-gray-400">of {storageLimit} GB</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#D84B68] rounded-full" style={{ width: `${(storageUsed / storageLimit) * 100}%` }} />
            </div>
          </GlassCard>
        </div>

        {/* FILES GRID LIST PANEL (Span 3) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search bar */}
          <div className="flex items-center space-x-2 bg-white px-3.5 py-1 rounded-full border border-gray-250 focus-within:ring-2 focus-within:ring-rose-500/20 max-w-md transition-all">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent px-0 py-2 text-xs md:text-sm focus:ring-0 w-full focus:outline-hidden"
            />
          </div>

          <GlassCard hoverEffect="none" interactive={false} className="bg-white border-gray-200/50 p-0 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm text-gray-600">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-3xs text-gray-400 font-bold uppercase select-none">
                    <th className="py-4 px-6">File Name</th>
                    <th className="py-4 px-6">Folder</th>
                    <th className="py-4 px-6">Size</th>
                    <th className="py-4 px-6">Created</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-gray-600">
                  {filteredFiles.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2.5">
                          <FileText className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                          <span className="text-gray-900 font-bold truncate max-w-[240px]" title={f.name}>{f.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="neutral">{f.folder}</Badge>
                      </td>
                      <td className="py-4 px-6 text-gray-400">{f.size}</td>
                      <td className="py-4 px-6 text-gray-400">{f.date}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => handleDownload(f.name)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer"
                            aria-label="Download File"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(f.id, f.name)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            aria-label="Delete File"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredFiles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-gray-400 font-medium select-none">
                        No files matching directory parameters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* UPLOAD FILE DIALOG */}
      <Dialog isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)}>
        <form onSubmit={handleUploadFile} className="space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FCE7EB] text-[#D84B68] rounded-xl">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Upload Workspace Document</h3>
              <p className="text-xs text-gray-500">Import target list databases, attachments, or client folders</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-dashed border-gray-200 rounded-3xl bg-gray-50 p-6 text-center select-none">
              <UploadCloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-600">Drag & Drop file templates here</p>
              <p className="text-3xs text-gray-400 mt-1">Supports PDF, XLSX, CSV up to 25MB</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="f-name" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">File Name</label>
              <Input
                id="f-name"
                type="text"
                placeholder="e.g. Figma_Lead_Database"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="f-folder" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Target Folder</label>
                <select
                  id="f-folder"
                  value={fileFolder}
                  onChange={(e) => setFileFolder(e.target.value)}
                  className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden"
                >
                  <option value="Audits">Audits</option>
                  <option value="Client Files">Client Files</option>
                  <option value="Screenshots">Screenshots</option>
                  <option value="Exports">Exports</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="f-type" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">File Type Extension</label>
                <select
                  id="f-type"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="flex w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-hidden"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="docx">DOCX</option>
                  <option value="xlsx">XLSX</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="f-size" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Simulated Size</label>
                <Input
                  id="f-size"
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isUploading} variant="primary" size="sm">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
              Upload File
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

// Local mock loader to prevent compilation issues
function Loader2({ className }: { className?: string }) {
  return <UploadCloud className={`${className} animate-pulse`} />;
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModuleWithStats } from "@/types";
import { parseTags, getLevelLabel, getLevelColor } from "@/lib/utils";
import { ModuleForm } from "@/components/admin/ModuleForm";

export default function AdminModulesPage() {
  const [modules, setModules] = useState<ModuleWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleWithStats | null>(null);

  const fetchModules = useCallback(() => {
    fetch("/api/modules")
      .then((res) => res.json())
      .then((data) => {
        setModules(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      await fetch(`/api/modules/${id}`, { method: "DELETE" });
      fetchModules();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (mod: ModuleWithStats) => {
    setEditingModule(mod);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingModule(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Kelola Materi</h1>
          <p className="text-slate-500">Manajemen katalog materi dan metadata tag untuk optimasi AI.</p>
        </div>
        <Button onClick={handleAddNew} className="shrink-0 gap-2 font-bold shadow-md shadow-blue-500/20">
          <Plus className="h-4 w-4" /> Tambah Materi
        </Button>
      </div>

      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-4 pl-6">ID & Judul</th>
                <th className="p-4">Level</th>
                <th className="p-4">Kategori / Tags (Metadata AI)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : modules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada materi.</td>
                </tr>
              ) : (
                modules.map((mod) => {
                  const tags = parseTags(mod.tags);
                  return (
                    <tr key={mod.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="font-mono text-[10px] text-slate-400 mb-1">{mod.id}</div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                          {mod.title}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold border-transparent ${getLevelColor(mod.level)}`}>
                          {getLevelLabel(mod.level)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                          {tags.slice(0, 3).map((t: string) => (
                            <span key={t} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter">
                              {t}
                            </span>
                          ))}
                          {tags.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-bold ml-1">+{tags.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${mod.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {mod.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(mod)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(mod.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModule ? "Edit Materi" : "Tambah Materi Baru"}</DialogTitle>
          </DialogHeader>
          {isFormOpen && (
            <ModuleForm
              initialData={editingModule}
              onSuccess={() => {
                setIsFormOpen(false);
                fetchModules();
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModuleWithStats } from "@/types";
import { parseTags, getLevelColor, getLevelLabel } from "@/lib/utils";

export default function ModulesCatalogPage() {
  const [modules, setModules] = useState<ModuleWithStats[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/modules")
      .then((res) => res.json())
      .then((data) => {
        setModules(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredModules = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      parseTags(m.tags).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Katalog Materi
          </h1>
          <p className="mt-2 text-slate-500">
            Jelajahi semua modul pembelajaran yang tersedia di platform.
          </p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari kelas atau topik..."
              className="pl-9 h-10 rounded-full bg-white border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white border border-slate-100 p-6 flex flex-col gap-4">
              <div className="h-6 w-24 skeleton rounded" />
              <div className="h-6 w-3/4 skeleton rounded" />
              <div className="h-16 w-full skeleton rounded" />
              <div className="h-10 w-full skeleton rounded mt-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => {
            const tags = parseTags(mod.tags);
            return (
              <Card key={mod.id} className="group flex flex-col border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 2).map((t) => (
                        <span key={t} className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                          {t}
                        </span>
                      ))}
                      {tags.length > 2 && (
                        <span className="bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center border border-slate-100">
                          +{tags.length - 2}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className={`ml-2 text-[10px] uppercase font-bold border-transparent ${getLevelColor(mod.level)}`}>
                      {getLevelLabel(mod.level)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {mod.description}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      {mod._count?.logs || 0} interaksi
                    </div>
                    <Button asChild size="sm" className="rounded-xl font-bold px-4" variant="secondary">
                      <Link href={`/modules/${mod.id}`}>Lihat Detail</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredModules.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-3xl border-dashed">
              <h3 className="text-lg font-semibold text-slate-900">Materi tidak ditemukan</h3>
              <p className="text-slate-500">Coba ubah kata kunci pencarian Anda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

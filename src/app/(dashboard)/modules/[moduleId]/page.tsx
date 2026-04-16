"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle2, PlayCircle, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModuleWithStats } from "@/types";
import { parseTags, getLevelLabel } from "@/lib/utils";
import Link from "next/link";

export default function ModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [module, setModule] = useState<ModuleWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetch(`/api/modules/${moduleId}`)
      .then((res) => res.json())
      .then((data) => {
        setModule(data);
        setLoading(false);
        // Log "CLICK" activity (skip for Guest)
        if (session?.user?.id && session?.user?.role !== "GUEST") {
          fetch("/api/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session.user.id,
              moduleId: moduleId,
              action: "CLICK",
            }),
          }).catch(console.error);
        }
      })
      .catch(() => setLoading(false));
  }, [moduleId, session?.user?.id]);

  const handleComplete = async () => {
    if (!session?.user?.id) return;
    setSubmitting(true);
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: moduleId,
          action: "COMPLETE",
          rating: rating > 0 ? rating : null,
        }),
      });
      setDone(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  if (!module) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-slate-800">Materi tidak ditemukan</h2>
      <Button variant="link" onClick={() => router.back()} className="mt-4">
        Kembali
      </Button>
    </div>
  );

  const tags = parseTags(module.tags);

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Katalog
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-slate-900 to-slate-800 p-8 flex flex-col justify-end relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="relative z-10 flex items-center gap-3">
            <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none uppercase tracking-widest text-[10px]">
              {getLevelLabel(module.level)}
            </Badge>
            <span className="text-white/60 text-sm flex items-center gap-1.5">
              <PlayCircle className="h-4 w-4" /> 1 Video Materi
            </span>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            {module.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((t: string) => (
              <span key={t} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                {t}
              </span>
            ))}
          </div>

          <div className="prose prose-slate max-w-none prose-p:leading-relaxed mb-12">
            <p className="text-lg text-slate-600">{module.description}</p>
          </div>

          {session?.user?.role === "GUEST" ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 text-center">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">Login sebagai Student</h3>
              <p className="text-sm text-slate-500 mb-6">
                Anda perlu login sebagai Student untuk submit progress dan menyimpan aktivitas pembelajaran Anda.
              </p>
              <Button asChild variant="outline" className="border-slate-200">
                <Link href="/login">Login Sekarang</Link>
              </Button>
            </div>
          ) : !done ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8">
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Selesaikan Materi Ini</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xl">
                Setelah mempelajari materi (simulasi), berikan rating kepuasan Anda dan tandai materi ini sebagai selesai untuk meng-update rekomendasi AI Anda.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Beri Rating (Opsional)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl transition-all ${rating >= star ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-400 bg-white border border-slate-200 shadow-sm'}`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleComplete}
                disabled={submitting}
                size="lg"
                className="w-full sm:w-auto px-8"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                )}
                Selesaikan Materi
              </Button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">Luar Biasa!</h3>
              <p className="text-emerald-600 mb-6">Materi telah diselesaikan. {rating > 0 && `Rating: ${rating} bintang.`} Histori Anda telah diperbarui.</p>
              <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                <Link href="/dashboard">Cek Rekomendasi Baru</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, BrainCircuit, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              E
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Learn<span className="text-blue-600">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Masuk
            </Link>
            <Button asChild className="rounded-full shadow-md shadow-blue-500/20">
              <Link href="/register">Mulai Gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center relative">
          {/* Decorative blurs */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 -z-10 w-[600px] h-[400px] bg-blue-400/20 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 -z-10 w-[400px] h-[300px] bg-purple-400/20 rounded-full blur-[100px]" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Platform E-Learning Masa Depan
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up animate-delay-100">
            Belajar Lebih Fokus,<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Tanpa Ribet Cari Materi.
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
            <Button asChild size="lg" className="rounded-full h-14 px-8 text-base shadow-xl shadow-blue-500/20 w-full sm:w-auto">
              <Link href="/login">
                Mulai Belajar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Rekomendasi Materi Pintar</h3>
              <p className="text-slate-500 leading-relaxed">
                Dapatkan saran materi pembelajaran yang disesuaikan dengan minat dan tingkat pemahaman Anda secara akurat.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Belajar Sesuai Minat</h3>
              <p className="text-slate-500 leading-relaxed">
                Pilih jalur pembelajaran yang Anda inginkan, mulai dari Web Development hingga Artificial Intelligence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Transparansi Rekomendasi</h3>
              <p className="text-slate-500 leading-relaxed">
                Ketahui alasan yang jelas mengapa suatu materi atau topik pembelajaran disarankan khusus untuk Anda pelajari.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

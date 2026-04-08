export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="flex flex-1 flex-col justify-center items-center px-4 py-12 sm:px-6 w-full">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          {children}
        </div>
      </div>
      
      <div className="relative w-full bg-slate-900 px-6 py-16 sm:px-12 lg:px-20 flex flex-col justify-center items-center text-white overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Platform E-Learning <br/> Berbasis <span className="text-blue-400">AI</span>
            </h2>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
            Dapatkan rekomendasi materi yang dipersonalisasi khusus untuk Anda, berdasarkan gaya dan histori belajar Anda.
          </p>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left w-full">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Personalisasi AI</h3>
                <p className="text-sm text-slate-400 mt-1">Rekomendasi yang menyesuaikan dengan profil Anda</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Analisis Histori</h3>
                <p className="text-sm text-slate-400 mt-1">Sistem terus belajar dari setiap aktivitas Anda</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-1/4 -mt-20 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 h-[20rem] w-[20rem] rounded-full bg-purple-500/10 blur-[128px] pointer-events-none" />
      </div>
    </div>
  );
}

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
      

    </div>
  );
}

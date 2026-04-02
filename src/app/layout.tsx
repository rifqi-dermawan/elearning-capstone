// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        <style>{`body { font-family: 'Inter', sans-serif; }`}</style>
      </head>
      <body className="bg-[#F8FAFC] antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}

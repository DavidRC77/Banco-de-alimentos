import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Deportes Cochabamba",
  description: "Sistema de gestión de reservas deportivas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-[#f8fafc] flex h-screen overflow-hidden text-slate-800 antialiased">

        <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col h-full shrink-0 shadow-xl z-10">
          <div className="p-6 border-b border-slate-700/50">
            <h1 className="text-xl font-bold text-white tracking-tight">Sistema Deportes</h1>
            <p className="text-sm text-slate-400 font-medium">Cochabamba</p>
          </div>

          <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
            <NavItem href="/" label="Dashboard" icon="📊" />
            <NavItem href="/clientes" label="Clientes" icon="👥" />
            <NavItem href="/canchas" label="Canchas" icon="🏆" />
            <NavItem href="/reservas" label="Reservas" icon="📅" />
            <NavItem href="/disponibilidad" label="Disponibilidad" icon="🕒" />
            <div className="my-4 border-t border-slate-700/50"></div>
            <NavItem href="/reportes" label="Reportes de Pagos" icon="📄" />
            <NavItem href="/configuracion" label="Configuración" icon="⚙️" />
          </nav>

          <div className="p-4 border-t border-slate-700/50 flex items-center gap-3 bg-[#0f172a]/30 hover:bg-[#0f172a]/50 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-slate-400">admin@deportes.com</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 h-full overflow-y-auto bg-[#f8fafc]">
          <div className="p-8">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white text-slate-300 transition-all duration-200 group"
    >
      <span className="text-lg opacity-80 group-hover:opacity-100">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
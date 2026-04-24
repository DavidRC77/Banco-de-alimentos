"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ clientes: 0, canchas: 0, reservasHoy: 0, ingresosHoy: 0 });
  const [reservasHoy, setReservasHoy] = useState<any[]>([]);
  const [proximasReservas, setProximasReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClientes, resCanchas, resReservas] = await Promise.all([
          fetch("http://localhost:3001/api/clientes"),
          fetch("http://localhost:3001/api/canchas"),
          fetch("http://localhost:3001/api/reservas")
        ]);

        const clientes = await resClientes.json();
        const canchas = await resCanchas.json();
        const reservas = await resReservas.json();

        const hoy = "2026-04-24";

        const resHoy = reservas.filter((r: any) => r.fecha === hoy);
        const proxRes = reservas.filter((r: any) => r.fecha > hoy).slice(0, 4);

        let ingresos = 0;
        resHoy.forEach((r: any) => {
          if (r.canchas?.nombre?.includes("Fútbol")) ingresos += 120;
          else if (r.canchas?.nombre?.includes("Paddle")) ingresos += 90;
          else ingresos += 80;
        });

        setStats({
          clientes: clientes.length || 0,
          canchas: canchas.length || 0,
          reservasHoy: resHoy.length || 0,
          ingresosHoy: ingresos
        });

        setReservasHoy(resHoy);
        setProximasReservas(proxRes);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
        <p className="text-slate-500 mt-1">Resumen general de las instalaciones y reservas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Clientes" value={stats.clientes.toString()} icon="👥" badgeColor="bg-blue-500 text-white" />
        <StatCard title="Canchas Disponibles" value={stats.canchas.toString()} icon="🏆" badgeColor="bg-green-500 text-white" />
        <StatCard title="Reservas del Día" value={stats.reservasHoy.toString()} icon="📅" badgeColor="bg-orange-500 text-white" />
        <StatCard title="Ingresos Hoy" value={`Bs. ${stats.ingresosHoy}`} icon="💲" badgeColor="bg-purple-500 text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Reservas de hoy</h2>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <p className="text-slate-500">Cargando...</p>
            ) : reservasHoy.length === 0 ? (
              <p className="text-slate-500">No hay reservas para hoy.</p>
            ) : (
              reservasHoy.map((reserva) => (
                <ReservaItem
                  key={reserva.id}
                  hora={reserva.hora_inicio.substring(0, 5)}
                  cliente={reserva.clientes?.nombre || "Sin Nombre"}
                  cancha={reserva.canchas?.nombre || "Sin Cancha"}
                  estado="confirmada"
                  color="green"
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Próximas Reservas</h2>
          </div>
          <div className="p-6">
            <div className="border-l-2 border-blue-500 ml-3 pl-5 space-y-8 py-2">
              {loading ? (
                <p className="text-slate-500">Cargando...</p>
              ) : proximasReservas.length === 0 ? (
                <p className="text-slate-500">No hay reservas próximas.</p>
              ) : (
                proximasReservas.map((reserva) => (
                  <ProximaReserva
                    key={reserva.id}
                    fecha={`${reserva.fecha} - ${reserva.hora_inicio.substring(0, 5)}`}
                    cliente={reserva.clientes?.nombre || "Sin Nombre"}
                    cancha={reserva.canchas?.nombre || "Sin Cancha"}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, badgeColor }: { title: string, value: string, icon: string, badgeColor: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-extrabold text-slate-900 mt-2">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm ${badgeColor}`}>
        {icon}
      </div>
    </div>
  );
}

function ReservaItem({ hora, cliente, cancha, estado, color }: { hora: string, cliente: string, cancha: string, estado: string, color: 'green' | 'orange' }) {
  const bgColors = {
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-5">
        <span className="text-slate-500 font-medium flex items-center gap-2">
          🕒 {hora}
        </span>
        <div>
          <p className="font-bold text-slate-900">{cliente}</p>
          <p className="text-sm text-slate-500">{cancha}</p>
        </div>
      </div>
      <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${bgColors[color]}`}>
        {estado}
      </span>
    </div>
  );
}

function ProximaReserva({ fecha, cliente, cancha }: { fecha: string, cliente: string, cancha: string }) {
  return (
    <div className="relative">
      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[27px] top-1 border-4 border-white"></div>
      <p className="text-xs font-semibold text-blue-600 mb-1">{fecha}</p>
      <p className="font-bold text-slate-900">{cliente}</p>
      <p className="text-sm text-slate-500">{cancha}</p>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function ReportesPage() {
    const [reservas, setReservas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3001/api/reservas")
            .then(res => res.json())
            .then(data => {
                setReservas(data);
                setLoading(false);
            });
    }, []);

    const totalPagado = reservas
        .filter(r => r.estado_pago === 'pagado')
        .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);

    const totalPendiente = reservas
        .filter(r => r.estado_pago === 'pendiente')
        .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-slate-900">Reportes de Pagos</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm font-medium text-slate-500">Total Recaudado</p>
                    <p className="text-3xl font-extrabold text-green-600">Bs. {totalPagado}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm font-medium text-slate-500">Por Cobrar</p>
                    <p className="text-3xl font-extrabold text-orange-500">Bs. {totalPendiente}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm font-medium text-slate-500">Total Reservas</p>
                    <p className="text-3xl font-extrabold text-slate-900">{reservas.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr className="text-slate-500 text-xs uppercase border-b border-slate-100">
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Cancha</th>
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Monto</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {reservas.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">{r.clientes?.nombre}</td>
                                <td className="px-6 py-4 text-slate-600">{r.canchas?.nombre}</td>
                                <td className="px-6 py-4 text-slate-600">{r.fecha}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">Bs. {r.monto}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${r.estado_pago === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {r.estado_pago}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
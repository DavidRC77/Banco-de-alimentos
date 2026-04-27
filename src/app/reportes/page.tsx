"use client";

import { useEffect, useState } from "react";

export default function ReportesPage() {
    const [reservas, setReservas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroFecha, setFiltroFecha] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/api/reservas?all=true")
            .then(res => res.json())
            .then(data => {
                setReservas(data);
                setLoading(false);
            });
    }, []);

    const reservasFiltradas = filtroFecha
        ? reservas.filter(r => r.fecha === filtroFecha)
        : reservas;

    const totalPagado = reservasFiltradas
        .filter(r => r.estado_pago === 'pagado')
        .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);

    const totalPendiente = reservasFiltradas
        .filter(r => r.estado_pago === 'pendiente')
        .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);

    const handleCambiarEstadoPago = async (id: number, nuevoEstado: string) => {
        try {
            const res = await fetch(`http://localhost:3001/api/reservas/${id}/estado-pago`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado_pago: nuevoEstado })
            });

            if (res.ok) {
                const reservaActualizada = await res.json();
                setReservas(reservas.map(r => r.id === id ? reservaActualizada : r));
            }
        } catch (error) {
            console.error("Error actualizando estado de pago:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Reportes de Pagos</h1>
                <p className="text-slate-500 mt-1">Gestión y seguimiento de pagos</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Filtrar por fecha</label>
                <input
                    type="date"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm font-medium text-slate-500">Total Recaudado</p>
                    <p className="text-3xl font-extrabold text-green-600">Bs. {totalPagado.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm font-medium text-slate-500">Por Cobrar</p>
                    <p className="text-3xl font-extrabold text-orange-500">Bs. {totalPendiente.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm font-medium text-slate-500">Total Reservas</p>
                    <p className="text-3xl font-extrabold text-slate-900">{reservasFiltradas.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr className="text-slate-500 text-xs uppercase border-b border-slate-100">
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Cancha</th>
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Hora</th>
                            <th className="px-6 py-4 font-semibold">Monto</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-slate-500">Cargando datos...</td>
                            </tr>
                        ) : reservasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-slate-500">No hay reservas registradas</td>
                            </tr>
                        ) : (
                            reservasFiltradas.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{r.clientes?.nombre}</td>
                                    <td className="px-6 py-4 text-slate-600">{r.canchas?.nombre}</td>
                                    <td className="px-6 py-4 text-slate-600">{r.fecha}</td>
                                    <td className="px-6 py-4 text-slate-600">{r.hora_inicio}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">Bs. {r.monto || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${r.estado_pago === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {r.estado_pago || 'pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleCambiarEstadoPago(r.id, r.estado_pago === 'pagado' ? 'pendiente' : 'pagado')}
                                            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
                                        >
                                            {r.estado_pago === 'pagado' ? 'Marcar pendiente' : 'Marcar pagado'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
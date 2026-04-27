"use client";

import { useEffect, useState } from "react";

interface Cancha {
    id: number;
    nombre: string;
    tipo: string;
    estado?: string;
    precio_por_hora?: number;
    fecha_mantenimiento?: string;
    hora_inicio_mantenimiento?: string;
    hora_fin_mantenimiento?: string;
}

export default function CanchasPage() {
    const [canchas, setCanchas] = useState<Cancha[]>([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState<number | null>(null);
    const [formMantenimiento, setFormMantenimiento] = useState({
        fecha: "",
        horaInicio: "",
        horaFin: ""
    });

    useEffect(() => {
        fetch("http://localhost:3001/api/canchas")
            .then((res) => {
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setCanchas(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando canchas:", err);
                alert("❌ No se pudo conectar al servidor API.\n\nAsegúrate de ejecutar: npm run dev:api");
                setLoading(false);
            });
    }, []);

    const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
        try {
            const updateData: any = { estado: nuevoEstado };
            
            if (nuevoEstado === 'mantenimiento') {
                if (!formMantenimiento.fecha || !formMantenimiento.horaInicio || !formMantenimiento.horaFin) {
                    alert("Por favor completa fecha y horarios de mantenimiento");
                    return;
                }
                updateData.fecha_mantenimiento = formMantenimiento.fecha;
                updateData.hora_inicio_mantenimiento = formMantenimiento.horaInicio;
                updateData.hora_fin_mantenimiento = formMantenimiento.horaFin;
            }

            const res = await fetch(`http://localhost:3001/api/canchas/${id}/estado`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });

            if (res.ok) {
                const canchaActualizada = await res.json();
                setCanchas(canchas.map(c => c.id === id ? canchaActualizada : c));
                setEditando(null);
                setFormMantenimiento({ fecha: "", horaInicio: "", horaFin: "" });
            }
        } catch (error) {
            console.error("Error actualizando estado:", error);
        }
    };

    const getEstadoColor = (estado?: string) => {
        switch (estado) {
            case 'mantenimiento':
                return 'bg-red-100 text-red-700';
            case 'disponible':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Canchas</h1>
                    <p className="text-slate-500 mt-1">Gestión de canchas deportivas y estados</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                    + Nueva Cancha
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Nombre</th>
                                <th className="px-6 py-4 font-semibold">Tipo Deporte</th>
                                <th className="px-6 py-4 font-semibold">Precio por Hora</th>
                                <th className="px-6 py-4 font-semibold">Estado</th>
                                <th className="px-6 py-4 font-semibold">Mantenimiento</th>
                                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                                        Cargando canchas desde la base de datos...
                                    </td>
                                </tr>
                            ) : canchas.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                                        No se encontraron canchas.
                                    </td>
                                </tr>
                            ) : (
                                canchas.map((cancha) => (
                                    <tr key={cancha.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">{cancha.id}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{cancha.nombre}</td>
                                        <td className="px-6 py-4 text-slate-600">{cancha.tipo}</td>
                                        <td className="px-6 py-4 text-slate-600">Bs. {cancha.precio_por_hora || 120}</td>
                                        <td className="px-6 py-4">
                                            {editando === cancha.id ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleCambiarEstado(cancha.id, 'disponible')}
                                                        className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full hover:bg-green-200 transition-colors"
                                                    >
                                                        Disponible
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (formMantenimiento.fecha && formMantenimiento.horaInicio && formMantenimiento.horaFin) {
                                                                handleCambiarEstado(cancha.id, 'mantenimiento');
                                                            } else {
                                                                alert("Completa los datos de mantenimiento primero");
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full hover:bg-red-200 transition-colors"
                                                    >
                                                        Mantenimiento
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getEstadoColor(cancha.estado)}`}>
                                                    {cancha.estado || 'disponible'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {cancha.estado === 'mantenimiento' && cancha.fecha_mantenimiento ? (
                                                <div className="space-y-1">
                                                    <p className="font-semibold">{cancha.fecha_mantenimiento}</p>
                                                    <p className="text-slate-500">{cancha.hora_inicio_mantenimiento} - {cancha.hora_fin_mantenimiento}</p>
                                                </div>
                                            ) : editando === cancha.id && cancha.estado !== 'mantenimiento' ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="date"
                                                        value={formMantenimiento.fecha}
                                                        onChange={(e) => setFormMantenimiento({ ...formMantenimiento, fecha: e.target.value })}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                                                    />
                                                    <input
                                                        type="time"
                                                        value={formMantenimiento.horaInicio}
                                                        onChange={(e) => setFormMantenimiento({ ...formMantenimiento, horaInicio: e.target.value })}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                                                        placeholder="Inicio"
                                                    />
                                                    <input
                                                        type="time"
                                                        value={formMantenimiento.horaFin}
                                                        onChange={(e) => setFormMantenimiento({ ...formMantenimiento, horaFin: e.target.value })}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                                                        placeholder="Fin"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => setEditando(editando === cancha.id ? null : cancha.id)}
                                                className={`text-lg transition-colors ${editando === cancha.id ? 'text-orange-500 hover:text-orange-700' : 'text-blue-500 hover:text-blue-700'}`}
                                            >
                                                {editando === cancha.id ? '✖️' : '✏️'}
                                            </button>
                                            <button className="text-red-500 hover:text-red-700 text-lg">🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
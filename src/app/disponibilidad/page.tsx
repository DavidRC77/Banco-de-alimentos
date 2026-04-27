"use client";

import { useEffect, useState } from "react";

interface Cancha {
    id: number;
    nombre: string;
    estado?: string;
    fecha_mantenimiento?: string;
    hora_inicio_mantenimiento?: string;
    hora_fin_mantenimiento?: string;
}

interface Reserva {
    id: number;
    cancha_id: number;
    fecha: string;
    hora_inicio: string;
}

export default function DisponibilidadPage() {
    const [canchas, setCanchas] = useState<Cancha[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    const horas = [
        "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00",
        "16:00", "17:00", "18:00", "19:00"
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [resCanchas, resReservas] = await Promise.all([
                    fetch("http://localhost:3001/api/canchas"),
                    fetch("http://localhost:3001/api/reservas?all=true")
                ]);

                if (!resCanchas.ok || !resReservas.ok) {
                    throw new Error("Error al cargar datos del servidor");
                }

                setCanchas(await resCanchas.json());
                setReservas(await resReservas.json());
            } catch (error) {
                console.error("Error cargando datos:", error);
                alert("❌ No se pudo conectar al servidor API.\n\nAsegúrate de ejecutar: npm run dev:api");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getEstado = (cancha: Cancha, hora: string) => {
        // Verificar si está en mantenimiento
        if (cancha.estado === 'mantenimiento' && cancha.fecha_mantenimiento === fecha) {
            if (cancha.hora_inicio_mantenimiento && cancha.hora_fin_mantenimiento) {
                const horaNum = parseInt(hora.split(':')[0]);
                const horaInicioNum = parseInt(cancha.hora_inicio_mantenimiento.split(':')[0]);
                const horaFinNum = parseInt(cancha.hora_fin_mantenimiento.split(':')[0]);

                if (horaNum >= horaInicioNum && horaNum < horaFinNum) {
                    return "Mant.";
                }
            }
        }

        // Verificar si está reservado
        const estaReservado = reservas.find(
            (r) => r.cancha_id === cancha.id && r.fecha === fecha && r.hora_inicio.startsWith(hora)
        );

        return estaReservado ? "Ocupado" : "Libre";
    };

    const getStyle = (estado: string) => {
        if (estado === "Libre") return "bg-green-100 text-green-700 border-green-200";
        if (estado === "Ocupado") return "bg-blue-100 text-blue-700 border-blue-200";
        if (estado === "Pendiente") return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-orange-100 text-orange-700 border-orange-200";
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Disponibilidad</h1>
                    <p className="text-slate-500 mt-1">Estado de las canchas por hora</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                    <label className="text-sm font-bold text-slate-500 uppercase">Fecha:</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="border-none focus:ring-0 text-slate-700 font-medium cursor-pointer"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex gap-6 mb-8 p-4 bg-slate-50 rounded-xl w-fit border border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
                        <span className="text-sm font-medium text-slate-600">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div>
                        <span className="text-sm font-medium text-slate-600">Reservado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200"></div>
                        <span className="text-sm font-medium text-slate-600">Mantenimiento</span>
                    </div>
                </div>

                <div className="overflow-x-auto pb-4">
                    {loading ? (
                        <div className="py-10 text-center text-slate-500 font-medium">
                            Cargando disponibilidad...
                        </div>
                    ) : (
                        <table className="w-full border-separate border-spacing-2">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-400 uppercase tracking-wider sticky left-0 bg-white z-10">
                                        Cancha
                                    </th>
                                    {horas.map((hora) => (
                                        <th key={hora} className="px-2 py-2 text-center text-xs font-bold text-slate-500 uppercase">
                                            {hora}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {canchas.map((cancha) => (
                                    <tr key={cancha.id}>
                                        <td className="px-4 py-3 font-bold text-slate-900 text-sm whitespace-nowrap sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                            {cancha.nombre}
                                        </td>
                                        {horas.map((hora) => {
                                            const estado = getEstado(cancha, hora);
                                            return (
                                                <td key={`${cancha.id}-${hora}`} className="p-0">
                                                    <div className={`h-12 min-w-[70px] flex items-center justify-center rounded-lg border text-[10px] font-bold uppercase transition-all shadow-sm ${getStyle(estado)}`}>
                                                        {estado}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
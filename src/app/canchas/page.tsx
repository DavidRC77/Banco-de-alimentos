"use client";

import { useEffect, useState } from "react";

interface Cancha {
    id: number;
    nombre: string;
    tipo: string;
}

export default function CanchasPage() {
    const [canchas, setCanchas] = useState<Cancha[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Canchas</h1>
                    <p className="text-slate-500 mt-1">Gestión de canchas deportivas</p>
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
                                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                                        Cargando canchas desde la base de datos...
                                    </td>
                                </tr>
                            ) : canchas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                                        No se encontraron canchas.
                                    </td>
                                </tr>
                            ) : (
                                canchas.map((cancha) => (
                                    <tr key={cancha.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">{cancha.id}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{cancha.nombre}</td>
                                        <td className="px-6 py-4 text-slate-600">{cancha.tipo}</td>
                                        <td className="px-6 py-4 text-slate-600">Bs. 120</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                disponible
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button className="text-blue-500 hover:text-blue-700 text-lg">✏️</button>
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
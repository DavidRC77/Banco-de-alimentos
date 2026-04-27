"use client";

import { useEffect, useState } from "react";

interface Cancha {
    id: number;
    nombre: string;
    tipo: string;
    ubicacion?: string;
    precio_por_hora?: number;
}

export default function CanchasCrudPage() {
    const [canchas, setCanchas] = useState<Cancha[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
    const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
    const [canchaAEliminar, setCanchaAEliminar] = useState<number | null>(null);
    const [editando, setEditando] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "",
        ubicacion: "",
        precio_por_hora: ""
    });
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

    useEffect(() => {
        fetchCanchas();
    }, []);

    const fetchCanchas = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/canchas");
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();
            setCanchas(data);
            setLoading(false);
        } catch (err) {
            console.error("Error cargando canchas:", err);
            setMensaje({ tipo: "error", texto: "No se pudo conectar al servidor API. Asegúrate de ejecutar: npm run dev:api" });
            setLoading(false);
        }
    };

    const handleAgregarCancha = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nombre.trim() || !formData.tipo.trim()) {
            setMensaje({ tipo: "error", texto: "Nombre y tipo de cancha son requeridos" });
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/api/canchas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    tipo: formData.tipo,
                    ubicacion: formData.ubicacion,
                    precio_por_hora: parseFloat(formData.precio_por_hora) || 120
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Error al crear cancha");
            }

            setFormData({ nombre: "", tipo: "", ubicacion: "", precio_por_hora: "" });
            setIsCrearModalOpen(false);
            setMensaje({ tipo: "exito", texto: "Cancha agregada exitosamente" });
            setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
            await fetchCanchas();
        } catch (error: any) {
            console.error("Error:", error);
            setMensaje({ tipo: "error", texto: "Error al agregar cancha: " + error.message });
        }
    };

    const handleActualizarCancha = async (id: number) => {
        const cancha = canchas.find(c => c.id === id);
        if (!cancha) return;

        try {
            const res = await fetch(`http://localhost:3001/api/canchas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: formData.nombre || cancha.nombre,
                    tipo: formData.tipo || cancha.tipo,
                    ubicacion: formData.ubicacion || cancha.ubicacion || "",
                    precio_por_hora: parseFloat(formData.precio_por_hora) || cancha.precio_por_hora || 120
                })
            });

            if (!res.ok) throw new Error("Error al actualizar");

            const canchaActualizada = await res.json();
            setCanchas(canchas.map(c => c.id === id ? canchaActualizada : c));
            setEditando(null);
            setIsEditarModalOpen(false);
            setFormData({ nombre: "", tipo: "", ubicacion: "", precio_por_hora: "" });
            setMensaje({ tipo: "exito", texto: "Cancha actualizada exitosamente" });
            setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
        } catch (error: any) {
            console.error("Error:", error);
            setMensaje({ tipo: "error", texto: "Error al actualizar cancha" });
        }
    };

    const confirmarEliminar = async () => {
        if (!canchaAEliminar) return;

        try {
            const res = await fetch(`http://localhost:3001/api/canchas/${canchaAEliminar}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Error al eliminar");

            setCanchas(canchas.filter(c => c.id !== canchaAEliminar));
            setIsEliminarModalOpen(false);
            setCanchaAEliminar(null);
            setMensaje({ tipo: "exito", texto: "Cancha eliminada exitosamente" });
            setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
        } catch (error: any) {
            console.error("Error:", error);
            setMensaje({ tipo: "error", texto: "Error al eliminar cancha" });
            setIsEliminarModalOpen(false);
        }
    };

    const iniciarEdicion = (cancha: Cancha) => {
        setEditando(cancha.id);
        setFormData({
            nombre: cancha.nombre,
            tipo: cancha.tipo,
            ubicacion: cancha.ubicacion || "",
            precio_por_hora: (cancha.precio_por_hora || 120).toString()
        });
        setIsEditarModalOpen(true);
    };

    const abrirCrear = () => {
        setFormData({ nombre: "", tipo: "", ubicacion: "", precio_por_hora: "" });
        setIsCrearModalOpen(true);
    };

    const abrirEliminar = (id: number) => {
        setCanchaAEliminar(id);
        setIsEliminarModalOpen(true);
    };

    const cancelarEdicion = () => {
        setEditando(null);
        setIsEditarModalOpen(false);
        setFormData({ nombre: "", tipo: "", ubicacion: "", precio_por_hora: "" });
    };

    const cancelarCrear = () => {
        setIsCrearModalOpen(false);
        setFormData({ nombre: "", tipo: "", ubicacion: "", precio_por_hora: "" });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Canchas</h1>
                    <p className="text-slate-500 mt-1">Gestión de canchas deportivas</p>
                </div>
                <button 
                    onClick={abrirCrear}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                    ➕ Nueva Cancha
                </button>
            </div>

            {/* Mensaje de notificación */}
            {mensaje.texto && (
                <div className={`p-4 rounded-lg font-medium ${
                    mensaje.tipo === "exito" 
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-red-100 text-red-700 border border-red-200"
                }`}>
                    {mensaje.tipo === "exito" ? "✅" : "❌"} {mensaje.texto}
                </div>
            )}

            {/* Tabla de canchas */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Nombre</th>
                                <th className="px-6 py-4 font-semibold">Tipo</th>
                                <th className="px-6 py-4 font-semibold">Ubicación</th>
                                <th className="px-6 py-4 font-semibold">Precio/Hora</th>
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
                                        No se encontraron canchas. ¡Agrega una nueva!
                                    </td>
                                </tr>
                            ) : (
                                canchas.map((cancha) => (
                                    <tr key={cancha.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 font-mono">{cancha.id}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{cancha.nombre}</td>
                                        <td className="px-6 py-4 text-slate-600">{cancha.tipo}</td>
                                        <td className="px-6 py-4 text-slate-600">{cancha.ubicacion || "-"}</td>
                                        <td className="px-6 py-4 text-slate-600">Bs. {cancha.precio_por_hora || 120}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => iniciarEdicion(cancha)}
                                                className="text-blue-500 hover:text-blue-700 text-lg"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => abrirEliminar(cancha.id)}
                                                className="text-red-500 hover:text-red-700 text-lg"
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Crear Cancha */}
            {isCrearModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">➕ Nueva Cancha</h2>
                        </div>
                        <form onSubmit={handleAgregarCancha} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: Cancha 1"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                    placeholder="Ej: Fútbol, Tenis, Básquet"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                                <input
                                    type="text"
                                    value={formData.ubicacion}
                                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                                    placeholder="Ej: Zona Norte"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Precio/Hora (Bs.)</label>
                                <input
                                    type="number"
                                    value={formData.precio_por_hora}
                                    onChange={(e) => setFormData({ ...formData, precio_por_hora: e.target.value })}
                                    placeholder="120"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={cancelarCrear}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Crear Cancha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar Cancha */}
            {isEditarModalOpen && editando && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">✏️ Editar Cancha</h2>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleActualizarCancha(editando); }} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                                <input
                                    type="text"
                                    value={formData.ubicacion}
                                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Precio/Hora (Bs.)</label>
                                <input
                                    type="number"
                                    value={formData.precio_por_hora}
                                    onChange={(e) => setFormData({ ...formData, precio_por_hora: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={cancelarEdicion}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Eliminación */}
            {isEliminarModalOpen && canchaAEliminar && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">🗑️ Eliminar Cancha</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-600">
                                ¿Estás seguro de que deseas eliminar esta cancha? <strong>Esta acción no se puede deshacer.</strong>
                            </p>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setIsEliminarModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminar}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Sí, Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

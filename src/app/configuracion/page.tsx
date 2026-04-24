"use client";

import { useEffect, useState } from "react";

export default function ConfiguracionPage() {
    const [config, setConfig] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Estados locales para los inputs
    const [form, setForm] = useState({
        hora_apertura: "",
        hora_cierre: "",
        duracion_reserva: "",
        requerir_pago_previo: "false"
    });

    useEffect(() => {
        fetch("http://localhost:3001/api/configuracion")
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                // Mapeamos los datos de la DB al estado del formulario
                const newForm = { ...form };
                data.forEach((item: any) => {
                    if (item.clave in newForm) {
                        // @ts-ignore
                        newForm[item.clave] = item.valor;
                    }
                });
                setForm(newForm);
                setLoading(false);
            })
            .catch(err => console.error("Error cargando config:", err));
    }, []);

    const handleUpdate = async (clave: string, valor: string) => {
        setSaving(true);
        try {
            await fetch("http://localhost:3001/api/configuracion", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clave, valor })
            });
            setSaving(false);
        } catch (error) {
            console.error("Error al actualizar:", error);
            setSaving(false);
        }
    };

    const saveAll = async () => {
        setSaving(true);
        // Actualizamos todas las claves en paralelo
        const promises = Object.entries(form).map(([clave, valor]) =>
            handleUpdate(clave, valor)
        );
        await Promise.all(promises);
        alert("Configuración guardada correctamente");
        setSaving(false);
    };

    if (loading) return <div className="p-8 text-slate-500 font-medium">Cargando ajustes...</div>;

    return (
        <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
                <p className="text-slate-500 mt-1">Ajustes generales del sistema y políticas</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
                {/* Sección Horarios */}
                <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Horarios de Atención</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hora de Apertura</label>
                            <input
                                type="time"
                                value={form.hora_apertura}
                                onChange={(e) => setForm({ ...form, hora_apertura: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hora de Cierre</label>
                            <input
                                type="time"
                                value={form.hora_cierre}
                                onChange={(e) => setForm({ ...form, hora_cierre: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Duración de Reserva (minutos)</label>
                        <input
                            type="number"
                            value={form.duracion_reserva}
                            onChange={(e) => setForm({ ...form, duracion_reserva: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                        />
                    </div>
                </div>

                {/* Sección Políticas */}
                <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Políticas de Pago</h2>
                    <div className="space-y-4 mb-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.requerir_pago_previo === "true"}
                                onChange={(e) => setForm({ ...form, requerir_pago_previo: e.target.checked ? "true" : "false" })}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-slate-700 font-medium">Requerir pago al momento de la reserva</span>
                        </label>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        onClick={saveAll}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <span>{saving ? "⏳" : "💾"}</span>
                        {saving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}
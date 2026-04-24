"use client";

import { useEffect, useState } from "react";

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
}

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

    const cargarClientes = () => {
        setLoading(true);
        fetch("http://localhost:3001/api/clientes")
            .then((res) => {
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setClientes(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando clientes:", err);
                alert("❌ No se pudo conectar al servidor API.\n\nAsegúrate de ejecutar: npm run dev:api");
                setLoading(false);
            });
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const eliminarCliente = async (id: number) => {
        if (confirm("¿Eliminar este cliente?")) {
            try {
                await fetch(`http://localhost:3001/api/clientes/${id}`, { method: "DELETE" });
                cargarClientes();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const abrirModalEditar = (cliente: Cliente) => {
        setClienteEditando(cliente);
        setIsModalOpen(true);
    };

    const actualizarCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clienteEditando) return;

        try {
            await fetch(`http://localhost:3001/api/clientes/${clienteEditando.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: clienteEditando.nombre,
                    telefono: clienteEditando.telefono,
                }),
            });
            setIsModalOpen(false);
            cargarClientes();
        } catch (err) {
            console.error(err);
        }
    };

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.telefono.includes(busqueda)
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
                    <p className="text-slate-500 mt-1">Gestión de clientes registrados</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                    + Nuevo Cliente
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <div className="relative max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o teléfono..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto h-[600px] overflow-y-auto relative">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                            <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Nombre</th>
                                <th className="px-6 py-4 font-semibold">Teléfono</th>
                                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Cargando clientes...</td>
                                </tr>
                            ) : clientesFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">No se encontraron resultados.</td>
                                </tr>
                            ) : (
                                clientesFiltrados.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">{cliente.id}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{cliente.nombre}</td>
                                        <td className="px-6 py-4 text-slate-600">{cliente.telefono}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => abrirModalEditar(cliente)}
                                                className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => eliminarCliente(cliente.id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
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

            {isModalOpen && clienteEditando && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">Editar Cliente</h2>
                        </div>
                        <form onSubmit={actualizarCliente} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={clienteEditando.nombre}
                                    onChange={(e) => setClienteEditando({ ...clienteEditando, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                                <input
                                    type="text"
                                    required
                                    value={clienteEditando.telefono}
                                    onChange={(e) => setClienteEditando({ ...clienteEditando, telefono: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
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
        </div>
    );
}
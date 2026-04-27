"use client";

import { useEffect, useState } from "react";

interface Cliente {
  id: number;
  nombre: string;
}

interface Cancha {
  id: number;
  nombre: string;
}

export default function ReservasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [canchas, setCanchas] = useState<Cancha[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [canchaId, setCanchaId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [monto, setMonto] = useState("");
  const [estadoPago, setEstadoPago] = useState("pendiente");

  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);

  const horasDisponibles = [
    "08:00", "09:00", "10:00", "11:00","12:00","13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, anchasRes] = await Promise.all([
          fetch("http://localhost:3001/api/clientes"),
          fetch("http://localhost:3001/api/canchas")
        ]);

        if (!clientesRes.ok || !anchasRes.ok) {
          throw new Error("Error al obtener datos del servidor");
        }

        const clientesData = await clientesRes.json();
        const anchasData = await anchasRes.json();

        setClientes(clientesData);
        setCanchas(anchasData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setMensaje({ 
          tipo: "error", 
          texto: "❌ No se pudo conectar al servidor API.\n\nAsegúrate de ejecutar en otra terminal: npm run dev:api" 
        });
      }
    };

    fetchData();
  }, []);

  const clienteSeleccionado = clientes.find((c) => c.id.toString() === clienteId);
  const canchaSeleccionada = canchas.find((c) => c.id.toString() === canchaId);

  const handleSubmit = async () => {
    if (!clienteId || !canchaId || !fecha || !horaInicio || !monto) {
      setMensaje({ tipo: "error", texto: "Por favor, completa todos los campos." });
      return;
    }

    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    const horaFin = `${(parseInt(horaInicio.split(":")[0]) + 1).toString().padStart(2, "0")}:00:00`;
    const reservaData = {
      cliente_id: parseInt(clienteId),
      cancha_id: parseInt(canchaId),
      fecha: fecha,
      hora_inicio: `${horaInicio}:00`,
      hora_fin: horaFin,
      monto: parseFloat(monto),
      estado_pago: estadoPago
    };

    try {
      const res = await fetch("http://localhost:3001/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaData)
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error || "Error al crear la reserva." });
      } else {
        setMensaje({ 
          tipo: "success", 
          texto: `¡Reserva confirmada! Estado de pago: ${estadoPago === 'pagado' ? 'PAGADO' : 'PENDIENTE'}` 
        });
        setClienteId("");
        setCanchaId("");
        setFecha("");
        setHoraInicio("");
        setMonto("");
        setEstadoPago("pendiente");
      }
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nueva Reserva</h1>
        <p className="text-slate-500 mt-1">Creación y gestión de reservas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

          {mensaje.texto && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-bold ${mensaje.tipo === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {mensaje.texto}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cliente</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
                >
                  <option value="">Seleccione un cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cancha</label>
                <select
                  value={canchaId}
                  onChange={(e) => setCanchaId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
                >
                  <option value="">Seleccione una cancha...</option>
                  {canchas.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hora de Inicio (1 hora de duración)</label>
              <div className="grid grid-cols-4 gap-3">
                {horasDisponibles.map((hora) => (
                  <button
                    key={hora}
                    onClick={() => setHoraInicio(hora)}
                    className={`py-2.5 border rounded-lg font-medium transition-colors ${horaInicio === hora ? "bg-blue-600 border-blue-600 text-white shadow-md" : "border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600"}`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Monto (Bs.)</label>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ejemplo: 120"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado de Pago</label>
                <select
                  value={estadoPago}
                  onChange={(e) => setEstadoPago(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Confirmar Reserva"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 h-fit sticky top-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Resumen de la Reserva</h3>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-slate-500 mb-1">Cliente</p>
              <p className="font-bold text-slate-900">{clienteSeleccionado ? clienteSeleccionado.nombre : "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Cancha</p>
              <p className="font-bold text-slate-900">{canchaSeleccionada ? canchaSeleccionada.nombre : "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Fecha</p>
              <p className="font-bold text-slate-900">{fecha || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Hora</p>
              <p className="font-bold text-slate-900">{horaInicio ? `${horaInicio} a ${(parseInt(horaInicio.split(":")[0]) + 1).toString().padStart(2, "0")}:00` : "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Monto</p>
              <p className="font-bold text-slate-900">{monto ? `Bs. ${monto}` : "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Estado de Pago</p>
              <p className={`font-bold text-lg ${estadoPago === 'pagado' ? 'text-green-600' : 'text-orange-600'}`}>
                {estadoPago === 'pagado' ? '✓ PAGADO' : '⏳ PENDIENTE'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import express from "express";
import cors from "cors";
import clienteRoutes from "./routes/cliente.routes";
import canchaRoutes from "./routes/cancha.routes";
import reservaRoutes from "./routes/reserva.routes";
import reporteRoutes from "./routes/reporte.route";
import configuracionRoutes from "./routes/configuracion.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/clientes", clienteRoutes);
app.use("/api/canchas", canchaRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/configuracion", configuracionRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
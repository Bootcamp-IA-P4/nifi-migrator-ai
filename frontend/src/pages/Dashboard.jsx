import React, { useState, useEffect } from "react";
import { getAllFlows } from "../services/api";
import {
  Loader2,
  GitBranch,
  Send,
  Trash2,
  Server,
  Cpu,
  CloudUpload,
  Activity,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";

const Dashboard = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingState, setSendingState] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        setLoading(true);
        const flowFiles = await getAllFlows();
        const flowsWithStatus = flowFiles.map((file) => ({
          id: file.id,
          name: file.name,
          status: "Procesado",
        }));
        setFlows(flowsWithStatus);
      } catch (err) {
        setError("No se pudieron cargar los flujos. " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFlows();
  }, []);

  const handleSendToRegistry = async (flowName) => {
    setSendingState((prev) => ({ ...prev, [flowName]: "enviando" }));
    await new Promise((r) => setTimeout(r, 1500));
    setSendingState((prev) => ({ ...prev, [flowName]: "enviado" }));
  };

  const handleDelete = (flowId) => {
    if (window.confirm("¿Eliminar este flujo?")) {
      setFlows(flows.filter((flow) => flow.id !== flowId));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Procesado:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      Analizando:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      Error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const sidebarItems = [
    { icon: Home, label: "Inicio" },
    { icon: CloudUpload, label: "Cargar" },
    { icon: Activity, label: "Flujos" },
    { icon: BarChart3, label: "Reportes" },
    { icon: Settings, label: "Configuración" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* 🧭 SIDEBAR */}
      <aside className="w-64 bg-white/80 dark:bg-[#121c2e]/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between fixed h-screen z-40">
        <div>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-extrabold text-[#006FFF] dark:text-[#6CA8FF] tracking-tight">
              NiFi Migrator
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Control Center
            </p>
          </div>

          <nav className="mt-6 px-2 space-y-1">
            {sidebarItems.map((item, idx) => (
              <button
                key={idx}
                className="flex items-center w-full gap-3 px-4 py-3 text-sm rounded-xl text-gray-700 dark:text-gray-300 hover:text-[#006FFF] hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          v1.0 • Powered by AI
        </div>
      </aside>

      {/* ⚙️ CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-10">
        {/* HEADER */}
        <header className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#006FFF] dark:text-[#6CA8FF]">
                Dashboard de Flujos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitorea y gestiona tus flujos migrados de NiFi.
              </p>
            </div>

            <button className="px-6 py-2 bg-gradient-to-r from-[#006FFF] to-[#00BFFF] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all">
              + Nuevo Flujo
            </button>
          </div>
        </header>

        {/* ESTADO DE SISTEMA */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { icon: Cpu, label: "Agentes activos", value: "5" },
            { icon: Activity, label: "Migraciones en curso", value: "3" },
            { icon: CloudUpload, label: "Flujos totales", value: flows.length },
            { icon: GitBranch, label: "Último despliegue", value: "hace 2h" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
            >
              <stat.icon className="w-7 h-7 text-[#006FFF] dark:text-[#00BFFF]" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* LISTA DE FLUJOS */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-[#006FFF]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 px-6 py-4 rounded-lg flex items-center gap-4">
            <div>
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-[#27354a]/60 text-gray-600 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Flujo</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {flows.map((flow, i) => (
                  <tr
                    key={flow.id}
                    className={`border-t border-gray-100 dark:border-gray-700 ${
                      i % 2 === 0
                        ? "bg-gray-50/70 dark:bg-[#223046]/30"
                        : "bg-white dark:bg-[#182236]/40"
                    } hover:bg-blue-50/40 dark:hover:bg-[#2b3a58]/40 transition-all`}
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <GitBranch className="w-5 h-5 text-blue-500 dark:text-[#00BFFF]" />
                      <span className="font-medium">{flow.name}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(flow.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSendToRegistry(flow.name)}
                          disabled={
                            sendingState[flow.name] === "enviando" ||
                            sendingState[flow.name] === "enviado"
                          }
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#006FFF] to-[#00BFFF] rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
                        >
                          {sendingState[flow.name] === "enviando" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send size={14} />
                          )}
                          {sendingState[flow.name] === "enviado"
                            ? "Enviado"
                            : "Enviar a Registry"}
                        </button>

                        <button
                          onClick={() => handleDelete(flow.id)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-all"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {flows.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-16 text-gray-500 dark:text-gray-400"
                    >
                      <Server className="w-10 h-10 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold">
                        No se encontraron flujos
                      </h3>
                      <p>Sube un archivo en la sección “Cargar” para comenzar.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

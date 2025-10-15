import React, { useState, useEffect } from "react";
import { getAllFlows, uploadTemplate } from "../services/api";
import { Loader2, GitBranch, Send, Trash2, Server, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingState, setSendingState] = useState({}); 

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        setLoading(true);
        const flowFiles = await getAllFlows();
        const flowsWithStatus = flowFiles.map(file => ({
          id: file.id,      
          name: file.name,  
          status: "Procesado",
        }));
        setFlows(flowsWithStatus);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los flujos. " + err.message);
        setFlows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlows();
  }, []);

  const handleSendToRegistry = async (flowName) => {
    setSendingState(prev => ({ ...prev, [flowName]: 'enviando' }));
    try {
      alert(`Simulando envío del flujo "${flowName}" al Registry...`);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setSendingState(prev => ({ ...prev, [flowName]: 'enviado' }));
    } catch (err) {
      alert(`Error al enviar "${flowName}": ${err.message}`);
      setSendingState(prev => ({ ...prev, [flowName]: 'error' }));
    }
  };

  const handleDelete = (flowId) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${flowId}"?`)) {
      setFlows(flows.filter(flow => flow.id !== flowId));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Procesado: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      Analizando: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      Subiendo: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    };
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${styles[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-8 font-inter text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#2663EB] dark:text-[#6CA8FF] tracking-tight">
            Dashboard de Flujos
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Gestiona y monitoriza todos los flujos de migración procesados.
          </p>
        </header>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-[#2663EB]" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 px-6 py-4 rounded-lg flex items-center gap-4">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {flows.map(flow => (
                <li key={flow.id} className="px-6 py-5 flex flex-wrap items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <GitBranch className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-semibold text-lg">{flow.name}</p>
                      {getStatusBadge(flow.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSendToRegistry(flow.name)}
                      disabled={sendingState[flow.name] === 'enviando' || sendingState[flow.name] === 'enviado'}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {sendingState[flow.name] === 'enviando' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={14} />}
                      {sendingState[flow.name] === 'enviado' ? 'Enviado' : 'Enviar a Registry'}
                    </button>
                    <button
                      onClick={() => handleDelete(flow.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {flows.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Server className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">No se encontraron flujos</h3>
                <p>Sube un archivo en la página de "Upload" para empezar.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
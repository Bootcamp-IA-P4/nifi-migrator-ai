// src/components/MermaidChart.jsx
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

// Inicializar SOLO una vez
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

const MermaidChart = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (chart && ref.current) {
      const renderDiagram = async () => {
        try {
          const cleanChart = chart.replace(/\\n/g, "\n").trim();
          const id = `mermaid-${Date.now()}`;

          const { svg } = await mermaid.render(id, cleanChart);
          ref.current.innerHTML = svg;
        } catch (error) {
          ref.current.innerHTML = `<pre style="color:red;">❌ Mermaid error:\n${error.message}</pre>`;
          console.error("Mermaid render error:", error);
        }
      };

      renderDiagram();
    }
  }, [chart]);

  return (
    <div
      ref={ref}
      className="mermaid w-full overflow-x-auto p-4 bg-white border rounded-lg"
    />
  );
};

export default MermaidChart;

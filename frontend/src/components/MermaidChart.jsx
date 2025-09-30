// src/components/MermaidChart.jsx
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

const MermaidChart = ({ chartCode }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    if (chartRef.current) {
      mermaid.render("mermaid-diagram", chartCode, (svgCode) => {
        chartRef.current.innerHTML = svgCode;
      });
    }
  }, [chartCode]);

  return <div ref={chartRef} />;
};

export default MermaidChart;

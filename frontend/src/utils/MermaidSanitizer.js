// utils/MermaidSanitizer.js

/**
 * Limpia y normaliza código Mermaid antes de renderizarlo
 * - Elimina caracteres invisibles o no-ASCII (como …)
 * - Quita paréntesis en labels (Mermaid no los soporta bien)
 * - Elimina comentarios con "#" o "//"
 * - Filtra solo líneas Mermaid válidas (graph TD, conexiones, etc.)
 * - Evita que líneas corruptas rompan todo el diagrama
 *
 * @param {string} code - Código Mermaid crudo extraído del markdown
 * @returns {string} - Código Mermaid listo para renderizar
 */
export function sanitizeMermaid(code) {
    if (!code || typeof code !== "string") return "";
  
    return code
      .trim()
      .replace(/\r/g, "")                  // limpia retornos de carro
      .replace(/\((.*?)\)/g, "$1")         // quita paréntesis de labels
      .replace(/#.*$/gm, "")               // elimina comentarios con #
      .replace(/\/\/.*$/gm, "")            // elimina comentarios con //
      .replace(/[^\S\r\n]+$/gm, "")        // elimina espacios al final de línea
      .replace(/[^\x20-\x7E\n\r\t]/g, "")  // elimina caracteres no-ASCII (como …)
      .split("\n")                         // divide en líneas
      .filter((line) => {
        const t = line.trim();
        // Mantener encabezado y líneas de conexión válidas
        return (
          t === "graph TD" ||
          /^[A-Za-z0-9_]+(\s*-->|-\.->|===|:::|--\|.*\|-->)\s*[A-Za-z0-9_\[\]\{\}]+/.test(t)
        );
      })
      .join("\n");
  }
  
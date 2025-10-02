// src/data/mockReport.js
const mockReport = {
  structured: {
    resumen_ejecutivo:
      "Este informe simulado muestra un flujo NiFi con bifurcaciones y loops para probar el renderizado de Mermaid en el frontend.",
    analisis_componentes: [
      { name: "DBCPConnectionPool", type: "DBCPConnectionPool" },
      { name: "JsonTreeReader", type: "JsonTreeReader" },
      { name: "JsonRecordSetWriter", type: "JsonRecordSetWriter" },
      { name: "ConvertRecord", type: "ConvertRecord" },
      { name: "EvaluateJsonPath", type: "EvaluateJsonPath" },
      { name: "InvokeHTTP", type: "InvokeHTTP" },
      { name: "PutFile", type: "PutFile" },
      { name: "AttributesToJSON", type: "AttributesToJSON" },
      { name: "PutDatabaseRecord", type: "PutDatabaseRecord" },
      { name: "UpdateAttribute", type: "UpdateAttribute" }
    ],
    recomendaciones: [
      "Verificar expresiones regulares en RouteOnAttribute.",
      "Asegurar que los directorios de salida existan antes de ejecutar PutFile.",
      "Validar atributos críticos después de UpdateAttribute."
    ],
    puntos_criticos: [
      "El procesador `RouteOnAttribute` puede fallar si el atributo no existe.",
      "Los bucles infinitos deben evitarse controlando condiciones en GenerateFlowFile."
    ],
    diagrama_flujo: `
      graph TD
        A[GenerateFlowFile] --> B{RouteOnAttribute}
        B -->|YES| C[PutFile]
        B -->|NO| D[LogAttribute]
        D --> E[UpdateAttribute]
        E --> B
        C --> F[End]
        E --> F
    `
  }
};

export default mockReport;

from crewai import Agent, Task, Crew, Process
from app.core.llms import llm_validator
import csv
import json
import re
from app.agents.audit_prompts import (
    AUDITOR_AGENT_ROLE,
    AUDITOR_AGENT_GOAL,
    AUDITOR_AGENT_BACKSTORY,
    AUDIT_TASK_DESCRIPTION,
    AUDIT_TASK_EXPECTED_OUTPUT
)

def load_mappings_as_text(dataset_path: str) -> str:
    mappings_text = "nifi1_component,nifi2_equivalent,status,property_changes,recommended_config\n"
    with open(dataset_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader)  
        for row in reader:
            mappings_text += ",".join(row) + "\n"
    return mappings_text

def run_audit(report_content: str, dataset_path: str) -> dict:
    migration_mappings = load_mappings_as_text(dataset_path)

    auditor_agent = Agent(
        role=AUDITOR_AGENT_ROLE,
        goal=AUDITOR_AGENT_GOAL,
        backstory=AUDITOR_AGENT_BACKSTORY,
        llm=llm_validator, 
        verbose=True,
        allow_delegation=False
    )

    audit_task = Task(
        description=AUDIT_TASK_DESCRIPTION.format(
            migration_mappings=migration_mappings,
            report_content=report_content
        ),
        expected_output=AUDIT_TASK_EXPECTED_OUTPUT,
        agent=auditor_agent
    )

    audit_crew = Crew(
        agents=[auditor_agent],
        tasks=[audit_task],
        process=Process.sequential,
        verbose=True
    )

    print("🚀 Crew de Auditoría finalizado. Procesando resultado...")
    result = audit_crew.kickoff()

    try:
        json_match = re.search(r"```json\s*(\{.*?\})\s*```", result.raw, re.DOTALL)
        
        json_string = ""
        if json_match:
            json_string = json_match.group(1)
        else:
            json_string = result.raw

        return json.loads(json_string)
    
    except json.JSONDecodeError:
        print(f"[Auditor ERROR] No se pudo parsear la salida del LLM. Salida cruda:\n{result.raw}")
        return {
            "final_verdict": "Error",
            "overall_summary": "The auditor agent failed to produce a valid JSON output. See the raw output for details.",
            "positive_points": [],
            "points_for_improvement": [
                "Could not parse the AI's response. The raw output was:",
                result.raw
            ] 
        }
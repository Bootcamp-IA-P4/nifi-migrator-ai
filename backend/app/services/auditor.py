from crewai import Agent, Task, Crew, Process
from app.core.llms import llm_validator
import csv
import json
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
        next(reader)  # Omitir la cabecera
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
        return json.loads(result.raw)
    except json.JSONDecodeError:
        return {
            "final_verdict": "Error",
            "overall_summary": "The auditor agent failed to produce a valid JSON output.",
            "positive_points": [],
            "points_for_improvement": [result] 
        }
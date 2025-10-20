from crewai import Agent
from app.core.llms import llm
from .prompts import (
    ANALYZER_AGENT_ROLE,
    ANALYZER_AGENT_GOAL,
    ANALYZER_AGENT_BACKSTORY,
    MAPPER_AGENT_ROLE,
    MAPPER_AGENT_GOAL,
    MAPPER_AGENT_BACKSTORY,
    CONVERTER_AGENT_ROLE,
    CONVERTER_AGENT_GOAL,
    CONVERTER_AGENT_BACKSTORY,
    REPORTER_AGENT_ROLE,
    REPORTER_AGENT_GOAL,
    REPORTER_AGENT_BACKSTORY
)

class NifiMigrationAgents:
    """
    This class defines the agents for the NiFi migration crew.
    It separates the agent definitions from the prompt details, which are
    imported from prompts.py for better maintainability.
    """
    def nifi_xml_analyzer(self) -> Agent:
        """Agent that analyzes the XML and identifies key components."""
        return Agent(
            role=ANALYZER_AGENT_ROLE,
            goal=ANALYZER_AGENT_GOAL,
            backstory=ANALYZER_AGENT_BACKSTORY,
            verbose=True,
            llm=llm,
        )

    def migration_mapper(self) -> Agent:
        """Agent that maps components to NiFi 2.x and identifies changes."""
        return Agent(
            role=MAPPER_AGENT_ROLE,
            goal=MAPPER_AGENT_GOAL,
            backstory=MAPPER_AGENT_BACKSTORY,
            verbose=True,
            llm=llm,
        )
    
    def flow_converter(self) -> Agent:
        """Agent that generates the new NiFi 2.x flow diagram."""
        return Agent(
            role=CONVERTER_AGENT_ROLE,
            goal=CONVERTER_AGENT_GOAL,
            backstory=CONVERTER_AGENT_BACKSTORY,
            verbose=True,
            llm=llm,
        )

    def report_generator(self) -> Agent:
        """Agent that generates a Markdown report from the analysis."""
        return Agent(
            role=REPORTER_AGENT_ROLE,
            goal=REPORTER_AGENT_GOAL,
            backstory=REPORTER_AGENT_BACKSTORY,
            verbose=True,
            llm=llm,
        )

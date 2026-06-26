from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import List
import os


@CrewBase
class InterviewCrew():
    """InterviewCrew crew"""

    agents: list[BaseAgent]
    tasks: list[Task]


    def __init__(self) -> None:
        # Initialize Gemini 1.5 Pro with a low temperature to enforce strict grading metrics
         self.llm = LLM(
            model="gemini/gemini-2.5-flash",
            temperature=0.2,
            api_key=os.environ.get("GEMINI_API_KEY")
        )


    @agent
    def cv_scanner(self) -> Agent:
        return Agent(
            config=self.agents_config['cv_scanner'], # type: ignore[index]
            llm=self.llm,
            verbose=True
        )

    @agent
    def primary_interviewer(self) -> Agent:
        return Agent(
            config=self.agents_config['primary_interviewer'], # type: ignore[index]
            llm=self.llm,
            verbose=True
        )
    
    @agent
    def followup_interviewer(self) -> Agent:
        return Agent(
            config=self.agents_config['followup_interviewer'], # type: ignore[index]
            llm=self.llm,
            verbose=True
        )

    @agent
    def grading_panel(self) -> Agent:
        return Agent(
            config=self.agents_config['grading_panel'], # type: ignore[index]
            llm=self.llm,
            verbose=True
        )


    @task
    def scan_task(self) -> Task:
        return Task(
            config=self.tasks_config['scan_task'], # type: ignore[index]
        )

    @task
    def generate_questions_task(self) -> Task:
        return Task(
            config=self.tasks_config['generate_questions_task'], # type: ignore[index]
            context=[self.scan_task()]
        )
    
    @task
    def followup_task(self) -> Task:
        return Task(
            config=self.tasks_config['followup_task'] # type: ignore[index]
        )
    
    @task
    def score_task(self) -> Task:
        return Task(
            config=self.tasks_config['score_task'], # type: ignore[index]
            context=[self.scan_task(),self.followup_task()]
        )

    @crew
    def question_generation_crew(self) -> Crew:
        """scan cv and generate primary questions"""
        return Crew(
            agents=[self.cv_scanner(), self.primary_interviewer()],
            tasks=[self.scan_task(), self.generate_questions_task()],
            process=Process.sequential,
            verbose=True,
        )
    
    @crew
    def evaluation_crew(self) -> Crew:
        """Evaluates the interview performance and generate follow up questions"""
        return Crew(
            agents=[self.followup_interviewer()],
            tasks=[self.followup_task()],
            process=Process.sequential,
            verbose=True,
        )
    
    @crew
    def final_grading_crew(self) -> Crew:
        """Final grading of the interview performance"""
        return Crew(
            agents=[self.grading_panel()],
            tasks=[self.score_task()],
            process=Process.sequential,
            verbose=True,
        )


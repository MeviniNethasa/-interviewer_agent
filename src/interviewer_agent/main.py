#!/usr/bin/env python
import json
import os
import asyncio
from typing import List, Dict
from pydantic import BaseModel, Field
from crewai import LLM
from crewai.flow.flow import Flow, listen, start
from interviewer_agent.crews.interview_crew.interview_crew import InterviewCrew


# Define our flow state
class InterviewState(BaseModel):
    job_description:str = ""
    cv_text:str = ""
    primary_questions_report:str = ""
    candidate_answers : str = ""
    followup_report:str = ""
    followup_answers:str = ""
    final_scorecard:str = ""

class InterviewFlow(Flow[InterviewState]):
    """Flow for creating a 4-agent automated interview system"""

    @start()
    def get_user_input(self):
        """step 1: Get user input for job description and CV text"""
        print("\n initialize interview set up\n")

        # Get user input
        self.state.job_description = input("Please enter the job description: ")
        self.state.cv_text = input("Please enter the candidate's CV text: ")

        print("######")
        print("User input received. Proceeding to the next step...\n")
        return self.state

    @listen(get_user_input)
    def generate_primary_questions(self, state):
        """run crew 1: Generate primary interview questions based on the job description and CV"""
        print("Generating primary questions...")

        interview_crew = InterviewCrew()
        result =  interview_crew.question_generation_crew().kickoff(inputs={
            "job_description": self.state.job_description,
            "cv_text": self.state.cv_text,
            "candidate_answers": "Pending collection in the next step"
        })
        self.state.primary_questions_report = result.raw

        print("Primary questions generated. Proceeding to the next step...\n")
        print(self.state.primary_questions_report)
      
        return self.state

    @listen(generate_primary_questions)
    def conduct_primary_interview(self):

        """collect candidate answers to the primary questions and run crew 2: Generate follow-up questions based on the candidate's answers"""
        print("Conducting the interview...")

        self.state.candidate_answers = input("Please enter the candidate's answers to the primary questions: ")

        print("Analyzing candidate answers and generating follow-up questions...")

        inputs={
            "cv_text": self.state.cv_text,
            "job_description": self.state.job_description,
            "candidate_answers": self.state.candidate_answers
        }

        result = InterviewCrew().followup_generation_crew().kickoff(inputs=inputs)
        self.state.followup_report = result.raw
        return self.state
    
    @listen(conduct_primary_interview)
    def conduct_followup_interview(self):

        """collect candidate answers to the follow-up questions and run crew 3: Generate final scorecard based on all inputs"""
        print("Conducting the follow-up interview...")

        self.state.followup_answers = input("Please enter the candidate's answers to the follow-up questions: ")

        print("Analyzing candidate answers and generating the report...")

        inputs={
            "cv_text": self.state.cv_text,
            "job_description": self.state.job_description,
            "primary_questions_report": self.state.primary_questions_report,
            "candidate_answers": self.state.candidate_answers,
            "followup_report": self.state.followup_report,
            "followup_answers": self.state.followup_answers
        }

        result = InterviewCrew().final_grading_crew().kickoff(inputs=inputs)
        self.state.final_scorecard = result.raw
        return self.state

    @listen(conduct_followup_interview)
    def save_and_display_scorecard(self):
        "save the final scorecard and display it to the user"

        os.makedirs("output", exist_ok=True)

        output_path="output/candidate_assessment.md"
        with open(output_path, "w") as f:
            f.write(self.state.final_scorecard)

        print(f"Final scorecard saved to {output_path}")
        print(self.state.final_scorecard)
        return "process complete "


def kickoff():
    """Run the pipeline flow"""
    flow=InterviewFlow()
    flow.kickoff()
    print("\n=== Flow Complete ===")
    print("Your comprehensive guide is ready in the output directory.")
    print("Open output/candidate_assessment.md to view it.")
def plot():
    """Force capture the chart data and save it directly into the project folder"""
    flow = InterviewFlow()
    
    # 1. Use the plot() command to get the raw HTML string contents from CrewAI
    html_content = flow.plot() 
    
    # 2. Force write that exact data string into a real file in your workspace
    output_filename = "interview_flow_chart.html"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"\n[SYSTEM SUCCESS]: Flow visualization map explicitly written to root folder!")
    print(f"File destination: {os.path.abspath(output_filename)}")


if __name__ == "__main__":
    kickoff()
    #plot()
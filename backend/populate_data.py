"""
Script to populate the Django database with data from the existing HTML site.
Run this from the backend directory: python populate_data.py
"""
import os
import sys
import django
from datetime import date

# Setup Django
os.environ.setdefault('DJANGO_SERVER_NAME', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
django.setup()

from company.models import Skill, WorkExperience, Project, SiteSettings

def populate_site_settings():
    """Populate site settings"""
    print("Creating site settings...")
    settings = SiteSettings.load()
    settings.site_title = "Fritz Automation"
    settings.tagline = "Software Developer & Designer"
    settings.about_text = """I am from the Midwest in the United States and am currently completing my bachelor's degree in Software Development with a focus on Web and Mobile Development. I am on track to graduate with honors, showcasing my dedication and hard work throughout my academic journey.

My journey in programming and development began with a self-taught approach, automating tasks during my early career. Over the years, I have honed my skills across various domains, including leadership, project management, engineering, finance, and logistics. My primary expertise lies in backend technologies, particularly those centered around Python."""
    settings.email = "forward@fritzautomation.dev"
    settings.github_url = "https://github.com/FritzAutomation"
    settings.linkedin_url = "https://www.linkedin.com/in/joshua-fritzjunker-53383590/"
    settings.save()
    print("[OK] Site settings created")

def populate_skills():
    """Populate skills from the HTML site"""
    print("\nCreating skills...")

    skills_data = [
        # Frontend
        {"name": "HTML", "category": "frontend", "proficiency": 85},
        {"name": "CSS", "category": "frontend", "proficiency": 80},
        {"name": "JavaScript", "category": "frontend", "proficiency": 75},

        # Backend
        {"name": "Python", "category": "backend", "proficiency": 95},
        {"name": "Django", "category": "backend", "proficiency": 90},
        {"name": "FastAPI", "category": "backend", "proficiency": 88},
        {"name": "Flask", "category": "backend", "proficiency": 85},
        {"name": "MySQL", "category": "database", "proficiency": 80},
        {"name": "SQLite", "category": "database", "proficiency": 85},
        {"name": "C#", "category": "backend", "proficiency": 70},
        {"name": "ASP.NET", "category": "backend", "proficiency": 68},

        # Tools & DevOps
        {"name": "Docker", "category": "tools", "proficiency": 82},
        {"name": "Nginx", "category": "tools", "proficiency": 75},
        {"name": "Uvicorn", "category": "tools", "proficiency": 80},
        {"name": "Git", "category": "tools", "proficiency": 90},
        {"name": "Azure", "category": "cloud", "proficiency": 75},
        {"name": "VS Code", "category": "tools", "proficiency": 95},
    ]

    for skill_data in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=skill_data["name"],
            defaults={
                "category": skill_data["category"],
                "proficiency": skill_data["proficiency"],
                "is_active": True
            }
        )
        if created:
            print(f"  [+] Created skill: {skill.name}")
        else:
            print(f"  [-] Skill already exists: {skill.name}")

def populate_work_experience():
    """Populate work experience from the HTML site"""
    print("\nCreating work experience...")

    experiences = [
        {
            "position": "North American ICT - MES Systems",
            "company": "CNH Industrial",
            "location": "United States",
            "start_date": date(2021, 1, 1),
            "end_date": None,
            "is_current": True,
            "description": "As an ICT Project Manager specializing in MES Systems within the NAFTA region, I have been responsible for overseeing the planning, implementation, and management of MES projects across multiple manufacturing plants. My role involves coordinating with cross-functional teams, managing project timelines and budgets, and ensuring the successful integration and optimization of MES systems to enhance manufacturing efficiency and productivity.",
            "order": 1
        },
        {
            "position": "Senior Business Analyst",
            "company": "CNH Industrial",
            "location": "United States",
            "start_date": date(2018, 1, 1),
            "end_date": date(2021, 1, 1),
            "is_current": False,
            "description": "As a Senior Business Analyst, I played a pivotal role in bridging the gap between business needs and technological solutions within the organization. My primary responsibility was to understand, analyze, and document business requirements. Additionally, I collaborated with stakeholders and development teams to deliver solutions that improve business performance and efficiency.",
            "order": 2
        },
        {
            "position": "Software Developer",
            "company": "CNH Industrial",
            "location": "United States",
            "start_date": date(2012, 1, 1),
            "end_date": date(2018, 1, 1),
            "is_current": False,
            "description": "As a Software Developer in a manufacturing facility, I was responsible for designing, developing, and maintaining software solutions that optimize production processes and improve operational efficiency. My role involved working closely with cross-functional teams to understand manufacturing needs, develop custom applications, and integrate new technologies to streamline operations.",
            "order": 3
        }
    ]

    for exp_data in experiences:
        exp, created = WorkExperience.objects.get_or_create(
            position=exp_data["position"],
            company=exp_data["company"],
            defaults=exp_data
        )
        if created:
            print(f"  [+] Created experience: {exp.position} at {exp.company}")
        else:
            print(f"  [-] Experience already exists: {exp.position}")

def populate_projects():
    """Populate projects from the HTML site"""
    print("\nCreating projects...")

    projects_data = [
        {
            "title": "Waterfall Scheduler",
            "slug": "waterfall-scheduler",
            "short_description": "Python automation tool for scheduling and managing sequential tasks",
            "description": "A comprehensive Python-based automation tool designed to schedule and manage sequential tasks in a waterfall methodology. Features include task dependencies, timeline visualization, and automated notifications.",
            "status": "completed",
            "featured": True,
            "order": 1
        },
        {
            "title": "RPG Dragon Repeller",
            "slug": "rpg-dragon-repeller",
            "short_description": "Interactive JavaScript role-playing game",
            "description": "A fun and engaging browser-based RPG game built with vanilla JavaScript. Players battle dragons, collect gold, and upgrade their weapons in this text-based adventure game.",
            "status": "completed",
            "featured": True,
            "github_url": "./game_index.html",
            "order": 2
        },
        {
            "title": "File Watchdog",
            "slug": "file-watchdog",
            "short_description": "Python file system monitoring and event handling",
            "description": "A robust Python application that monitors file system events and triggers automated actions based on file changes. Useful for automation workflows and real-time data processing.",
            "status": "completed",
            "featured": True,
            "order": 3
        },
        {
            "title": "Flask Scheduler App",
            "slug": "flask-scheduler-app",
            "short_description": "Web-based task scheduling application built with Flask",
            "description": "A modern web application built with Flask that provides an intuitive interface for scheduling and managing tasks. Features include user authentication, task priorities, and email notifications.",
            "status": "completed",
            "featured": True,
            "order": 4
        },
        {
            "title": "WIC Management System",
            "slug": "wic-management-system",
            "short_description": "Django-based work instruction card management platform",
            "description": "An enterprise-grade Django application for managing work instruction cards in manufacturing environments. Features include version control, approval workflows, and multi-language support.",
            "status": "completed",
            "featured": True,
            "order": 5
        },
        {
            "title": "Virtual Industrial Engineer",
            "slug": "virtual-ie",
            "short_description": "AI-powered industrial engineering analysis tool",
            "description": "An innovative AI-powered tool that assists industrial engineers with process analysis, optimization recommendations, and efficiency calculations. Leverages machine learning to provide data-driven insights.",
            "status": "completed",
            "featured": True,
            "order": 6
        }
    ]

    for proj_data in projects_data:
        project, created = Project.objects.get_or_create(
            slug=proj_data["slug"],
            defaults=proj_data
        )
        if created:
            print(f"  [+] Created project: {project.title}")
        else:
            print(f"  [-] Project already exists: {project.title}")

def main():
    """Main function to populate all data"""
    print("=" * 60)
    print("POPULATING DATABASE WITH DATA FROM HTML SITE")
    print("=" * 60)

    try:
        populate_site_settings()
        populate_skills()
        populate_work_experience()
        populate_projects()

        print("\n" + "=" * 60)
        print("[SUCCESS] DATABASE POPULATION COMPLETE!")
        print("=" * 60)
        print("\nSummary:")
        print(f"  Skills: {Skill.objects.count()}")
        print(f"  Work Experience: {WorkExperience.objects.count()}")
        print(f"  Projects: {Project.objects.count()}")
        print(f"\nYou can now view and edit this data in Django Admin:")
        print("  http://localhost:8000/admin/")

    except Exception as e:
        print(f"\n[ERROR] Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

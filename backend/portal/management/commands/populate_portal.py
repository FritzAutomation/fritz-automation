from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from portal.models import ClientProfile, ClientProject, ProjectUpdate, Ticket, TicketComment, ProjectFile
from datetime import datetime, timedelta
from django.utils import timezone
import os
from django.core.files.base import ContentFile


class Command(BaseCommand):
    help = 'Populate portal with sample data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample portal data...')

        # Create test clients
        clients = []
        client_data = [
            {
                'username': 'johndoe',
                'email': 'john@example.com',
                'password': 'testpass123',
                'first_name': 'John',
                'last_name': 'Doe',
                'company_name': 'Acme Corporation',
                'phone': '(555) 123-4567'
            },
            {
                'username': 'janesmith',
                'email': 'jane@example.com',
                'password': 'testpass123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'company_name': 'Tech Innovations LLC',
                'phone': '(555) 987-6543'
            }
        ]

        for data in client_data:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': data['email'],
                    'first_name': data['first_name'],
                    'last_name': data['last_name']
                }
            )
            if created:
                user.set_password(data['password'])
                user.save()
                self.stdout.write(f"[OK] Created user: {data['username']} (password: {data['password']})")
            else:
                self.stdout.write(f"[--] User {data['username']} already exists")

            profile, created = ClientProfile.objects.get_or_create(
                user=user,
                defaults={
                    'company_name': data['company_name'],
                    'phone': data['phone']
                }
            )
            if created:
                self.stdout.write(f"  [OK] Created profile for {data['company_name']}")

            clients.append(user)

        # Create projects
        projects_data = [
            {
                'client': clients[0],
                'title': 'E-commerce Automation Platform',
                'description': 'Automated order processing and inventory management system for Acme Corp. Includes real-time inventory tracking, automated email notifications, and integration with shipping providers.',
                'status': 'in_progress',
                'priority': 'high',
                'progress_percentage': 65,
                'start_date': timezone.now().date() - timedelta(days=45),
                'estimated_completion': timezone.now().date() + timedelta(days=30),
                'deliverables': '• Custom Django REST API\n• React admin dashboard\n• Automated email system\n• Shipping provider integration\n• Documentation and training',
                'staging_url': 'https://staging.acme-automation.com',
            },
            {
                'client': clients[0],
                'title': 'Customer Data Migration',
                'description': 'Migration of legacy customer database to new PostgreSQL system with data cleaning and validation.',
                'status': 'completed',
                'priority': 'medium',
                'progress_percentage': 100,
                'start_date': timezone.now().date() - timedelta(days=90),
                'estimated_completion': timezone.now().date() - timedelta(days=15),
                'actual_completion': timezone.now().date() - timedelta(days=10),
                'deliverables': '• Data extraction scripts\n• Data cleaning and validation\n• PostgreSQL schema design\n• Migration scripts\n• Verification reports',
                'production_url': 'https://acme-corp.com/customers',
            },
            {
                'client': clients[1],
                'title': 'Real-time Analytics Dashboard',
                'description': 'Interactive dashboard for monitoring website traffic, user behavior, and conversion metrics in real-time.',
                'status': 'planning',
                'priority': 'medium',
                'progress_percentage': 15,
                'start_date': timezone.now().date() - timedelta(days=10),
                'estimated_completion': timezone.now().date() + timedelta(days=60),
                'deliverables': '• FastAPI backend\n• Next.js dashboard\n• Real-time data streaming\n• Custom charts and visualizations\n• User authentication',
            },
        ]

        projects = []
        for proj_data in projects_data:
            project, created = ClientProject.objects.get_or_create(
                title=proj_data['title'],
                client=proj_data['client'],
                defaults=proj_data
            )
            if created:
                self.stdout.write(f"[OK] Created project: {proj_data['title']}")
            projects.append(project)

        # Create project updates
        updates_data = [
            {
                'project': projects[0],
                'title': 'API Development Complete',
                'description': 'Completed development of all REST API endpoints. Implemented authentication, order management, and inventory tracking endpoints. All unit tests passing.',
                'created_by': None,  # Will be set to admin
            },
            {
                'project': projects[0],
                'title': 'Frontend Dashboard 80% Complete',
                'description': 'React admin dashboard is coming along nicely. Completed order management, inventory views, and basic reporting. Working on shipping integration UI next.',
                'created_by': None,
            },
            {
                'project': projects[0],
                'title': 'Staging Environment Ready',
                'description': 'Deployed to staging server. Please review at the staging URL and let us know if you have any feedback!',
                'created_by': None,
            },
            {
                'project': projects[1],
                'title': 'Project Complete',
                'description': 'Successfully migrated all 50,000+ customer records to the new database. Data validation complete with 99.8% accuracy. System is now live in production.',
                'created_by': None,
            },
            {
                'project': projects[2],
                'title': 'Project Kickoff',
                'description': 'Had initial meeting to discuss requirements and technical approach. Created project timeline and assigned tasks.',
                'created_by': None,
            },
        ]

        # Get admin user for creating updates
        admin_user = User.objects.filter(is_superuser=True).first()

        for update_data in updates_data:
            update_data['created_by'] = admin_user
            update, created = ProjectUpdate.objects.get_or_create(
                project=update_data['project'],
                title=update_data['title'],
                defaults=update_data
            )
            if created:
                self.stdout.write(f"  [OK] Created update: {update_data['title']}")

        # Create tickets
        tickets_data = [
            {
                'project': projects[0],
                'created_by': clients[0],
                'title': 'Order export not including tax column',
                'description': 'When I export orders to CSV, the tax amount column is missing. We need this for our accounting. Can you add it to the export?',
                'ticket_type': 'bug',
                'status': 'in_progress',
                'priority': 'medium',
                'assigned_to': admin_user,
            },
            {
                'project': projects[0],
                'created_by': clients[0],
                'title': 'Add bulk order status update feature',
                'description': 'Would be great to have a way to update multiple orders\' status at once instead of clicking each one individually. Maybe checkboxes + dropdown?',
                'ticket_type': 'feature',
                'status': 'open',
                'priority': 'low',
            },
            {
                'project': projects[0],
                'created_by': clients[0],
                'title': 'Email notifications not sending',
                'description': 'Customers are not receiving order confirmation emails. I checked spam folders - nothing. This is urgent as we have orders piling up!',
                'ticket_type': 'bug',
                'status': 'resolved',
                'priority': 'urgent',
                'assigned_to': admin_user,
                'resolved_at': timezone.now() - timedelta(hours=2),
            },
            {
                'project': projects[2],
                'created_by': clients[1],
                'title': 'Question about dashboard data refresh rate',
                'description': 'How often will the dashboard data refresh? Will it be real-time or every few seconds/minutes?',
                'ticket_type': 'question',
                'status': 'open',
                'priority': 'low',
            },
        ]

        tickets = []
        for ticket_data in tickets_data:
            ticket, created = Ticket.objects.get_or_create(
                title=ticket_data['title'],
                created_by=ticket_data['created_by'],
                defaults=ticket_data
            )
            if created:
                self.stdout.write(f"[OK] Created ticket: {ticket_data['title']}")
            tickets.append(ticket)

        # Create ticket comments
        comments_data = [
            {
                'ticket': tickets[0],
                'user': admin_user,
                'comment': 'Thanks for reporting this! I\'ll add the tax column to the export today. Should be included in tomorrow\'s deployment.',
                'is_internal': False,
            },
            {
                'ticket': tickets[2],
                'user': admin_user,
                'comment': 'Found the issue - SMTP credentials were incorrect on the production server. Fixed and tested. Emails are now sending correctly!',
                'is_internal': False,
            },
            {
                'ticket': tickets[2],
                'user': clients[0],
                'comment': 'Perfect! Just tested and confirmation emails are working now. Thanks for the quick fix!',
                'is_internal': False,
            },
        ]

        for comment_data in comments_data:
            comment, created = TicketComment.objects.get_or_create(
                ticket=comment_data['ticket'],
                user=comment_data['user'],
                comment=comment_data['comment'],
                defaults=comment_data
            )
            if created:
                self.stdout.write(f"  [OK] Created comment on ticket #{comment_data['ticket'].id}")

        # Create sample files
        files_data = [
            {
                'project': projects[0],
                'name': 'API Documentation.pdf',
                'description': 'Complete API documentation with all endpoints, authentication, and examples.',
                'category': 'document',
                'is_confidential': False,
            },
            {
                'project': projects[0],
                'name': 'Database Credentials.txt',
                'description': 'Production database access credentials. DO NOT SHARE.',
                'category': 'credential',
                'is_confidential': True,
            },
            {
                'project': projects[0],
                'name': 'Monthly Analytics Report.pdf',
                'description': 'Website traffic and conversion metrics for October 2024.',
                'category': 'report',
                'is_confidential': False,
            },
            {
                'project': projects[1],
                'name': 'Migration Summary Report.pdf',
                'description': 'Final migration report with statistics and validation results.',
                'category': 'report',
                'is_confidential': False,
            },
            {
                'project': projects[2],
                'name': 'Dashboard Wireframes.pdf',
                'description': 'UI/UX wireframes for the analytics dashboard.',
                'category': 'design',
                'is_confidential': False,
            },
        ]

        for file_data in files_data:
            # Create a dummy file
            file_content = f"This is a sample file: {file_data['name']}\n\nGenerated for testing purposes."

            file_obj, created = ProjectFile.objects.get_or_create(
                project=file_data['project'],
                name=file_data['name'],
                defaults={
                    **file_data,
                    'uploaded_by': admin_user,
                    'file': ContentFile(file_content.encode(), name=file_data['name']),
                }
            )
            if created:
                self.stdout.write(f"[OK] Created file: {file_data['name']}")

        self.stdout.write(self.style.SUCCESS('\n[SUCCESS] Sample data created successfully!'))
        self.stdout.write('\nTest Credentials:')
        self.stdout.write('  Username: johndoe')
        self.stdout.write('  Password: testpass123')
        self.stdout.write('')
        self.stdout.write('  Username: janesmith')
        self.stdout.write('  Password: testpass123')
        self.stdout.write('\nYou can now login to the portal at /portal/login')

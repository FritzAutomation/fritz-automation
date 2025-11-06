"""
Email notification utilities for the client portal
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
from .models import EmailPreferences


def send_ticket_created_email(ticket):
    """
    Notify admin when a new ticket is created
    """
    subject = f'[New Ticket #{ticket.id}] {ticket.title}'

    context = {
        'ticket': ticket,
        'site_name': settings.SITE_NAME,
        'site_url': settings.SITE_URL,
        'ticket_url': f"{settings.SITE_URL}/portal/tickets/{ticket.id}",
    }

    html_message = render_to_string('portal/emails/ticket_created.html', context)
    plain_message = strip_tags(html_message)

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        html_message=html_message,
        fail_silently=False,
    )


def send_ticket_comment_email(ticket, comment):
    """
    Notify client when admin comments on their ticket
    """
    # Don't send if the commenter is the client themselves
    if comment.user == ticket.created_by:
        return

    # Check user's email preferences
    try:
        prefs = EmailPreferences.objects.get(user=ticket.created_by)
        if not prefs.ticket_comments:
            return  # User has disabled ticket comment notifications
    except EmailPreferences.DoesNotExist:
        pass  # No preferences set, default to sending

    subject = f'[Ticket #{ticket.id}] New response: {ticket.title}'

    context = {
        'ticket': ticket,
        'comment': comment,
        'site_name': settings.SITE_NAME,
        'site_url': settings.SITE_URL,
        'ticket_url': f"{settings.SITE_URL}/portal/tickets/{ticket.id}",
    }

    html_message = render_to_string('portal/emails/ticket_comment.html', context)
    plain_message = strip_tags(html_message)

    # Send to ticket creator
    if ticket.created_by.email:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[ticket.created_by.email],
            html_message=html_message,
            fail_silently=False,
        )


def send_project_update_email(update):
    """
    Notify client when a project update is posted
    """
    project = update.project

    # Check user's email preferences
    try:
        prefs = EmailPreferences.objects.get(user=project.client)
        if not prefs.project_updates:
            return  # User has disabled project update notifications
    except EmailPreferences.DoesNotExist:
        pass  # No preferences set, default to sending

    subject = f'[{project.title}] New Update: {update.title}'

    context = {
        'project': project,
        'update': update,
        'site_name': settings.SITE_NAME,
        'site_url': settings.SITE_URL,
        'project_url': f"{settings.SITE_URL}/portal/projects/{project.id}",
    }

    html_message = render_to_string('portal/emails/project_update.html', context)
    plain_message = strip_tags(html_message)

    # Send to project client
    if project.client.email:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[project.client.email],
            html_message=html_message,
            fail_silently=False,
        )


def send_welcome_email(user, client_profile):
    """
    Send welcome email to new clients
    """
    subject = f'Welcome to {settings.SITE_NAME} Client Portal'

    context = {
        'user': user,
        'client_profile': client_profile,
        'site_name': settings.SITE_NAME,
        'site_url': settings.SITE_URL,
        'portal_url': f"{settings.SITE_URL}/portal/login",
    }

    html_message = render_to_string('portal/emails/welcome.html', context)
    plain_message = strip_tags(html_message)

    if user.email:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )

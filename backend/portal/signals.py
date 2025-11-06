"""
Django signals for sending email notifications
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from .models import Ticket, TicketComment, ProjectUpdate, ClientProfile
from .emails import (
    send_ticket_created_email,
    send_ticket_comment_email,
    send_project_update_email,
    send_welcome_email
)

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Ticket)
def notify_ticket_created(sender, instance, created, **kwargs):
    """
    Send email to admin when a new ticket is created
    """
    if created:
        try:
            send_ticket_created_email(instance)
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Error sending ticket created email: {e}", exc_info=True)


@receiver(post_save, sender=TicketComment)
def notify_ticket_comment(sender, instance, created, **kwargs):
    """
    Send email to client when admin comments on their ticket
    """
    if created:
        try:
            send_ticket_comment_email(instance.ticket, instance)
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Error sending ticket comment email: {e}", exc_info=True)


@receiver(post_save, sender=ProjectUpdate)
def notify_project_update(sender, instance, created, **kwargs):
    """
    Send email to client when a project update is posted
    """
    if created:
        try:
            send_project_update_email(instance)
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Error sending project update email: {e}", exc_info=True)


@receiver(post_save, sender=ClientProfile)
def notify_new_client(sender, instance, created, **kwargs):
    """
    Send welcome email to new clients
    """
    if created:
        try:
            send_welcome_email(instance.user, instance)
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Error sending welcome email: {e}", exc_info=True)

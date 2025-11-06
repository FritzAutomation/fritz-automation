"""
Email notification utilities for the company website
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags


def send_contact_form_email(contact_message):
    """
    Notify admin when a contact form is submitted
    """
    subject = f'[Contact Form] {contact_message.subject or "New Message from " + contact_message.name}'

    context = {
        'contact': contact_message,
        'site_name': settings.SITE_NAME,
        'site_url': settings.SITE_URL,
        'admin_url': f"{settings.SITE_URL.replace(':3000', ':8000')}/admin/company/contactmessage/{contact_message.id}/change/",
    }

    html_message = render_to_string('company/emails/contact_form.html', context)
    plain_message = strip_tags(html_message)

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        html_message=html_message,
        fail_silently=False,
    )

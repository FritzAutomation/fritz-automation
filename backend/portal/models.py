from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class ClientProfile(models.Model):
    """
    Extended user profile for clients with access to the portal
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    company_name = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='client_avatars/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.company_name}"

    class Meta:
        verbose_name = 'Client Profile'
        verbose_name_plural = 'Client Profiles'


class ClientProject(models.Model):
    """
    Client projects managed through the portal
    """
    STATUS_CHOICES = [
        ('discovery', 'Discovery'),
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('testing', 'Testing'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portal_projects')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='discovery')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')

    # Timeline
    start_date = models.DateField(null=True, blank=True)
    estimated_completion = models.DateField(null=True, blank=True)
    actual_completion = models.DateField(null=True, blank=True)

    # Deliverables & Progress
    deliverables = models.TextField(help_text='List of project deliverables', blank=True)
    progress_percentage = models.IntegerField(default=0, help_text='Project completion percentage 0-100')

    # URLs
    staging_url = models.URLField(blank=True, null=True)
    production_url = models.URLField(blank=True, null=True)
    repository_url = models.URLField(blank=True, null=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Client Project'
        verbose_name_plural = 'Client Projects'

    def __str__(self):
        return f"{self.title} - {self.client.username}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while ClientProject.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class ProjectUpdate(models.Model):
    """
    Updates/timeline entries for projects
    """
    project = models.ForeignKey(ClientProject, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project Update'
        verbose_name_plural = 'Project Updates'

    def __str__(self):
        return f"{self.project.title} - {self.title}"


class Ticket(models.Model):
    """
    Support tickets, bug reports, and feature requests
    """
    TYPE_CHOICES = [
        ('bug', 'Bug Report'),
        ('feature', 'Feature Request'),
        ('support', 'Support'),
        ('question', 'Question'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('waiting_client', 'Waiting on Client'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    project = models.ForeignKey(ClientProject, on_delete=models.CASCADE, related_name='tickets', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')

    title = models.CharField(max_length=200)
    description = models.TextField()
    ticket_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='support')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Ticket'
        verbose_name_plural = 'Tickets'

    def __str__(self):
        return f"#{self.pk} - {self.title} ({self.get_status_display()})"


class TicketComment(models.Model):
    """
    Comments/replies on tickets
    """
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    is_internal = models.BooleanField(default=False, help_text='Internal note not visible to client')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Ticket Comment'
        verbose_name_plural = 'Ticket Comments'

    def __str__(self):
        return f"Comment on {self.ticket.title} by {self.user.username}"


class ProjectFile(models.Model):
    """
    Files shared with clients - documents, credentials, reports, etc.
    """
    CATEGORY_CHOICES = [
        ('document', 'Document'),
        ('credential', 'Credential'),
        ('report', 'Report'),
        ('design', 'Design'),
        ('code', 'Code'),
        ('other', 'Other'),
    ]

    project = models.ForeignKey(ClientProject, on_delete=models.CASCADE, related_name='files')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='project_files/%Y/%m/')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='document')
    file_size = models.BigIntegerField(null=True, blank=True, help_text='File size in bytes')

    is_confidential = models.BooleanField(default=False, help_text='Mark sensitive files like credentials')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project File'
        verbose_name_plural = 'Project Files'

    def __str__(self):
        return f"{self.name} - {self.project.title}"

    def save(self, *args, **kwargs):
        if self.file and not self.file_size:
            self.file_size = self.file.size
        super().save(*args, **kwargs)

    @property
    def file_size_display(self):
        """Human-readable file size"""
        if not self.file_size:
            return "Unknown"

        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"


class EmailPreferences(models.Model):
    """
    User preferences for email notifications
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='email_preferences')

    # Notification preferences
    project_updates = models.BooleanField(default=True, help_text='Receive emails when projects are updated')
    ticket_comments = models.BooleanField(default=True, help_text='Receive emails when tickets receive comments')
    ticket_status_changes = models.BooleanField(default=True, help_text='Receive emails when ticket status changes')
    new_files = models.BooleanField(default=True, help_text='Receive emails when new files are uploaded')
    weekly_summary = models.BooleanField(default=False, help_text='Receive weekly project summary emails')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Email Preference'
        verbose_name_plural = 'Email Preferences'

    def __str__(self):
        return f"Email preferences for {self.user.username}"


class ProjectMilestone(models.Model):
    """
    Milestones for tracking project phases and key deliverables
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('delayed', 'Delayed'),
    ]

    project = models.ForeignKey(ClientProject, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Dates
    target_date = models.DateField(help_text='Target completion date')
    completed_date = models.DateField(null=True, blank=True, help_text='Actual completion date')

    # Ordering
    order = models.IntegerField(default=0, help_text='Display order (lower numbers first)')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['project', 'order', 'target_date']
        verbose_name = 'Project Milestone'
        verbose_name_plural = 'Project Milestones'

    def __str__(self):
        return f"{self.project.title} - {self.title}"

    @property
    def is_overdue(self):
        """Check if milestone is overdue"""
        from django.utils import timezone
        if self.status == 'completed':
            return False
        return self.target_date < timezone.now().date()

from django.db import models
from django.utils.text import slugify


class Skill(models.Model):
    """
    Skills/expertise displayed on the company website
    """
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('tools', 'Tools & DevOps'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    icon = models.URLField(max_length=500, blank=True, null=True, help_text='URL to skill icon image')
    order = models.IntegerField(default=0, help_text='Display order')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class WorkExperience(models.Model):
    """
    Work experience entries
    """
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True, help_text='Leave blank if current position')
    description = models.TextField()
    image = models.URLField(max_length=500, blank=True, null=True, help_text='URL to company/position image')
    is_current = models.BooleanField(default=False)
    order = models.IntegerField(default=0, help_text='Display order (0 = most recent)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-start_date']
        verbose_name = 'Work Experience'
        verbose_name_plural = 'Work Experiences'

    def __str__(self):
        return f"{self.position} at {self.company}"

    @property
    def duration(self):
        """Calculate duration in years/months"""
        from datetime import date
        end = self.end_date or date.today()
        delta = end - self.start_date
        years = delta.days // 365
        months = (delta.days % 365) // 30
        return f"{years}y {months}m" if years > 0 else f"{months}m"


class Project(models.Model):
    """
    Company showcase projects
    """
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
        ('planned', 'Planned'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_description = models.CharField(max_length=255, help_text='Brief one-liner description')
    description = models.TextField()
    image = models.URLField(max_length=500, help_text='URL to project image')
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    technologies = models.ManyToManyField(Skill, related_name='projects', blank=True)
    featured = models.BooleanField(default=False, help_text='Show on homepage')
    order = models.IntegerField(default=0, help_text='Display order')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ContactMessage(models.Model):
    """
    Contact form submissions
    """
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f"{self.name} - {self.subject or 'No subject'} ({self.created_at.strftime('%Y-%m-%d')})"


class SiteSettings(models.Model):
    """
    Global site settings (singleton pattern)
    """
    site_title = models.CharField(max_length=200, default='Fritz Automation')
    tagline = models.CharField(max_length=300, default='Software Developer & Designer')
    about_text = models.TextField(
        default='I am a passionate self-taught designer and developer. '
        'Specializing in backend technologies with Python, I am currently '
        'expanding my skills to include front-end technologies.'
    )
    hero_image = models.URLField(max_length=500, blank=True, null=True, help_text='URL to hero image')
    resume_file = models.URLField(max_length=500, blank=True, null=True, help_text='URL to resume PDF')

    # Social Links
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    email = models.EmailField(default='forward@fritzautomation.dev')

    # SEO
    meta_description = models.TextField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=300, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return 'Site Settings'

    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton)
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass  # Prevent deletion

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

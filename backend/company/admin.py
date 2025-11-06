from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import Skill, WorkExperience, Project, ContactMessage, SiteSettings


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency_display', 'icon_preview', 'is_active', 'order', 'project_count')
    list_filter = ('category', 'is_active')
    search_fields = ('name',)
    list_editable = ('order', 'is_active')
    ordering = ('category', 'order')

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'proficiency', 'icon')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )

    def icon_preview(self, obj):
        if obj.icon:
            return format_html('<img src="{}" width="30" height="30" style="object-fit: contain;" />', obj.icon)
        return '-'
    icon_preview.short_description = 'Icon'

    def proficiency_display(self, obj):
        color = '#22c55e' if obj.proficiency >= 80 else '#eab308' if obj.proficiency >= 60 else '#ef4444'
        return format_html(
            '<div style="display: flex; align-items: center; gap: 8px;">'
            '<div style="width: 100px; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">'
            '<div style="width: {}%; height: 100%; background: {};"></div>'
            '</div>'
            '<span style="font-weight: 600;">{} %</span>'
            '</div>',
            obj.proficiency, color, obj.proficiency
        )
    proficiency_display.short_description = 'Proficiency'

    def project_count(self, obj):
        count = obj.projects.count()
        if count > 0:
            return format_html('<span style="color: #0a61ae; font-weight: 600;">{}</span>', count)
        return '-'
    project_count.short_description = 'Projects'
    project_count.admin_order_field = 'projects__count'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(Count('projects'))

    actions = ['mark_as_active', 'mark_as_inactive']

    @admin.action(description='Mark selected skills as active')
    def mark_as_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} skill(s) marked as active.')

    @admin.action(description='Mark selected skills as inactive')
    def mark_as_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} skill(s) marked as inactive.')


@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ('position', 'company', 'location', 'date_range', 'duration_display', 'image_preview', 'is_current', 'order')
    list_filter = ('is_current', 'company')
    search_fields = ('position', 'company', 'description', 'location')
    list_editable = ('order', 'is_current')
    date_hierarchy = 'start_date'
    ordering = ('order', '-start_date')

    fieldsets = (
        ('Position Details', {
            'fields': ('company', 'position', 'location', 'image')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Description', {
            'fields': ('description',)
        }),
        ('Display Settings', {
            'fields': ('order',)
        }),
    )

    readonly_fields = ('created_at', 'updated_at')

    def date_range(self, obj):
        end = obj.end_date.strftime('%b %Y') if obj.end_date else 'Present'
        return f"{obj.start_date.strftime('%b %Y')} - {end}"
    date_range.short_description = 'Period'

    def duration_display(self, obj):
        return obj.duration
    duration_display.short_description = 'Duration'

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />', obj.image)
        return '-'
    image_preview.short_description = 'Image'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status_badge', 'image_preview', 'featured', 'tech_count', 'order', 'created_at')
    list_filter = ('status', 'featured', 'technologies')
    search_fields = ('title', 'description', 'short_description')
    list_editable = ('order', 'featured')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('technologies',)
    ordering = ('order', '-created_at')
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'short_description', 'status')
        }),
        ('Content', {
            'fields': ('description', 'image')
        }),
        ('Links', {
            'fields': ('github_url', 'live_url')
        }),
        ('Technologies', {
            'fields': ('technologies',)
        }),
        ('Display Settings', {
            'fields': ('featured', 'order')
        }),
    )

    readonly_fields = ('created_at', 'updated_at')

    def status_badge(self, obj):
        colors = {
            'completed': '#22c55e',
            'in_progress': '#3b82f6',
            'planned': '#eab308',
            'archived': '#6b7280',
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            colors.get(obj.status, '#6b7280'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" height="50" style="object-fit: cover; border-radius: 4px;" />', obj.image)
        return '-'
    image_preview.short_description = 'Image'

    def tech_count(self, obj):
        count = obj.technologies.count()
        if count > 0:
            return format_html('<span style="color: #0a61ae; font-weight: 600;">{}</span>', count)
        return '-'
    tech_count.short_description = 'Technologies'

    actions = ['mark_as_featured', 'mark_as_not_featured', 'mark_as_completed']

    @admin.action(description='Mark selected as featured')
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(featured=True)
        self.message_user(request, f'{updated} project(s) marked as featured.')

    @admin.action(description='Remove from featured')
    def mark_as_not_featured(self, request, queryset):
        updated = queryset.update(featured=False)
        self.message_user(request, f'{updated} project(s) removed from featured.')

    @admin.action(description='Mark as completed')
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} project(s) marked as completed.')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject_preview', 'status_badge', 'created_at', 'quick_actions')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at', 'updated_at', 'ip_address', 'user_agent', 'message_preview')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'subject')
        }),
        ('Message', {
            'fields': ('message_preview',)
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('ip_address', 'user_agent', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def subject_preview(self, obj):
        if obj.subject:
            return obj.subject[:50] + '...' if len(obj.subject) > 50 else obj.subject
        return format_html('<em style="color: #9ca3af;">No subject</em>')
    subject_preview.short_description = 'Subject'

    def status_badge(self, obj):
        colors = {
            'new': '#ef4444',
            'read': '#3b82f6',
            'replied': '#22c55e',
            'archived': '#6b7280',
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            colors.get(obj.status, '#6b7280'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def message_preview(self, obj):
        return format_html('<div style="padding: 12px; background: #f9fafb; border-radius: 6px; white-space: pre-wrap; color: #111827;">{}</div>', obj.message)
    message_preview.short_description = 'Message Content'

    def quick_actions(self, obj):
        return format_html(
            '<a href="mailto:{}" style="color: #0a61ae; text-decoration: none;">✉ Reply</a>',
            obj.email
        )
    quick_actions.short_description = 'Actions'

    actions = ['mark_as_read', 'mark_as_replied', 'mark_as_archived']

    @admin.action(description='Mark as read')
    def mark_as_read(self, request, queryset):
        updated = queryset.update(status='read')
        self.message_user(request, f'{updated} message(s) marked as read.')

    @admin.action(description='Mark as replied')
    def mark_as_replied(self, request, queryset):
        updated = queryset.update(status='replied')
        self.message_user(request, f'{updated} message(s) marked as replied.')

    @admin.action(description='Archive selected messages')
    def mark_as_archived(self, request, queryset):
        updated = queryset.update(status='archived')
        self.message_user(request, f'{updated} message(s) archived.')

    def has_add_permission(self, request):
        # Prevent manual addition of contact messages (should come from frontend)
        return False


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('General', {
            'fields': ('site_title', 'tagline', 'about_text', 'hero_image', 'resume_file')
        }),
        ('Social Links', {
            'fields': ('email', 'github_url', 'linkedin_url', 'twitter_url')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('updated_at',)

    def has_add_permission(self, request):
        # Only one instance allowed (singleton)
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of settings
        return False

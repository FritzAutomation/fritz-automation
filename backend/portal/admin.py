from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Q
from django.utils import timezone
from .models import ClientProfile, ClientProject, ProjectUpdate, Ticket, TicketComment, ProjectFile, EmailPreferences, ProjectMilestone


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ['user_info', 'company_name', 'phone', 'project_count', 'ticket_count', 'is_active_badge', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name', 'company_name', 'phone']
    readonly_fields = ['created_at', 'updated_at', 'activity_summary']

    fieldsets = (
        ('User Account', {
            'fields': ('user', 'is_active')
        }),
        ('Company Information', {
            'fields': ('company_name', 'phone', 'address')
        }),
        ('Activity Summary', {
            'fields': ('activity_summary',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def user_info(self, obj):
        name = obj.user.get_full_name() or obj.user.username
        return format_html(
            '<div><strong>{}</strong><br><small style="color: #6b7280;">{}</small></div>',
            name,
            obj.user.email
        )
    user_info.short_description = 'User'

    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: #22c55e;">● Active</span>')
        return format_html('<span style="color: #ef4444;">● Inactive</span>')
    is_active_badge.short_description = 'Status'

    def project_count(self, obj):
        count = obj.user.portal_projects.count()
        if count > 0:
            return format_html('<span style="color: #0a61ae; font-weight: 600;">{}</span>', count)
        return '-'
    project_count.short_description = 'Projects'

    def ticket_count(self, obj):
        count = obj.user.created_tickets.count()
        if count > 0:
            return format_html('<span style="color: #0a61ae; font-weight: 600;">{}</span>', count)
        return '-'
    ticket_count.short_description = 'Tickets'

    def activity_summary(self, obj):
        projects = obj.user.portal_projects.count()
        tickets = obj.user.created_tickets.count()
        open_tickets = obj.user.created_tickets.filter(status='open').count()

        return format_html(
            '<div style="padding: 12px; background: #f9fafb; border-radius: 6px;">'
            '<p><strong>Total Projects:</strong> {}</p>'
            '<p><strong>Total Tickets:</strong> {} ({} open)</p>'
            '<p><strong>Member Since:</strong> {}</p>'
            '</div>',
            projects,
            tickets,
            open_tickets,
            obj.created_at.strftime('%B %d, %Y')
        )
    activity_summary.short_description = 'Activity Summary'

    actions = ['activate_clients', 'deactivate_clients']

    @admin.action(description='Activate selected clients')
    def activate_clients(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} client(s) activated.')

    @admin.action(description='Deactivate selected clients')
    def deactivate_clients(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} client(s) deactivated.')


class ProjectUpdateInline(admin.StackedInline):
    model = ProjectUpdate
    extra = 0
    readonly_fields = ['created_at', 'created_by']
    fields = ['title', 'description', 'created_by', 'created_at']

    def has_change_permission(self, request, obj=None):
        return True


class TicketInline(admin.TabularInline):
    model = Ticket
    extra = 0
    fields = ['title', 'ticket_type', 'status', 'priority', 'created_by']
    readonly_fields = ['created_by', 'created_at']
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class ProjectFileInline(admin.TabularInline):
    model = ProjectFile
    extra = 0
    fields = ['name', 'file', 'category', 'is_confidential', 'uploaded_by']
    readonly_fields = ['uploaded_by', 'file_size']


@admin.register(ClientProject)
class ClientProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client_info', 'status_badge', 'priority_badge', 'progress_bar', 'update_count', 'ticket_count', 'start_date']
    list_filter = ['status', 'priority', 'start_date']
    search_fields = ['title', 'description', 'client__username', 'client__email', 'client__first_name', 'client__last_name']
    readonly_fields = ['slug', 'created_at', 'updated_at', 'last_activity']
    inlines = [ProjectUpdateInline, TicketInline, ProjectFileInline]
    date_hierarchy = 'start_date'

    fieldsets = (
        ('Basic Information', {
            'fields': ('client', 'title', 'slug', 'description')
        }),
        ('Status & Progress', {
            'fields': ('status', 'priority', 'progress_percentage')
        }),
        ('Timeline', {
            'fields': ('start_date', 'estimated_completion', 'actual_completion')
        }),
        ('Deliverables', {
            'fields': ('deliverables',),
            'classes': ('collapse',)
        }),
        ('URLs', {
            'fields': ('staging_url', 'production_url', 'repository_url'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'last_activity'),
            'classes': ('collapse',)
        }),
    )

    def client_info(self, obj):
        return format_html(
            '<strong>{}</strong><br><small style="color: #6b7280;">{}</small>',
            obj.client.get_full_name() or obj.client.username,
            obj.client.email
        )
    client_info.short_description = 'Client'

    def status_badge(self, obj):
        colors = {
            'planning': '#6b7280',
            'in_progress': '#3b82f6',
            'on_hold': '#eab308',
            'completed': '#22c55e',
            'cancelled': '#ef4444',
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            colors.get(obj.status, '#6b7280'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def priority_badge(self, obj):
        colors = {
            'low': '#22c55e',
            'medium': '#eab308',
            'high': '#ef4444',
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            colors.get(obj.priority, '#6b7280'),
            obj.get_priority_display()
        )
    priority_badge.short_description = 'Priority'

    def progress_bar(self, obj):
        color = '#22c55e' if obj.progress_percentage >= 80 else '#3b82f6' if obj.progress_percentage >= 50 else '#eab308'
        return format_html(
            '<div style="display: flex; align-items: center; gap: 8px;">'
            '<div style="width: 100px; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">'
            '<div style="width: {}%; height: 100%; background: {};"></div>'
            '</div>'
            '<span style="font-weight: 600;">{} %</span>'
            '</div>',
            obj.progress_percentage, color, obj.progress_percentage
        )
    progress_bar.short_description = 'Progress'

    def update_count(self, obj):
        count = obj.updates.count()
        if count > 0:
            return format_html('<span style="color: #0a61ae; font-weight: 600;">{}</span>', count)
        return '-'
    update_count.short_description = 'Updates'

    def ticket_count(self, obj):
        count = obj.tickets.count()
        open_count = obj.tickets.filter(status='open').count()
        if count > 0:
            return format_html('<span style="color: #0a61ae; font-weight: 600;">{}</span> <small>({} open)</small>', count, open_count)
        return '-'
    ticket_count.short_description = 'Tickets'

    actions = ['mark_in_progress', 'mark_completed', 'mark_on_hold']

    @admin.action(description='Mark as In Progress')
    def mark_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'{updated} project(s) marked as in progress.')

    @admin.action(description='Mark as Completed')
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed', actual_completion=timezone.now().date(), progress_percentage=100)
        self.message_user(request, f'{updated} project(s) marked as completed.')

    @admin.action(description='Mark as On Hold')
    def mark_on_hold(self, request, queryset):
        updated = queryset.update(status='on_hold')
        self.message_user(request, f'{updated} project(s) marked as on hold.')


@admin.register(ProjectUpdate)
class ProjectUpdateAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'created_by', 'created_at']
    list_filter = ['created_at', 'project']
    search_fields = ['title', 'description', 'project__title']
    readonly_fields = ['created_at']

    def save_model(self, request, obj, form, change):
        if not obj.created_by_id:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


class TicketCommentInline(admin.StackedInline):
    model = TicketComment
    extra = 0
    readonly_fields = ['created_at', 'updated_at', 'user']
    fields = ['user', 'comment', 'is_internal', 'created_at']


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_number', 'title', 'project', 'created_by_info', 'ticket_type_badge', 'status_badge', 'priority_badge', 'comment_count', 'created_at']
    list_filter = ['ticket_type', 'status', 'priority', 'created_at', 'project']
    search_fields = ['id', 'title', 'description', 'created_by__username', 'project__title']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    inlines = [TicketCommentInline]
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Ticket Information', {
            'fields': ('project', 'title', 'description', 'ticket_type')
        }),
        ('Assignment & Status', {
            'fields': ('created_by', 'assigned_to', 'status', 'priority')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )

    def ticket_number(self, obj):
        return format_html('<strong>#{}</strong>', obj.id)
    ticket_number.short_description = '#'

    def created_by_info(self, obj):
        return format_html(
            '<strong>{}</strong>',
            obj.created_by.get_full_name() or obj.created_by.username
        )
    created_by_info.short_description = 'Created By'

    def ticket_type_badge(self, obj):
        icons = {
            'bug': '🐛',
            'feature': '✨',
            'support': '💬',
            'question': '❓',
        }
        return format_html(
            '<span>{} {}</span>',
            icons.get(obj.ticket_type, ''),
            obj.get_ticket_type_display()
        )
    ticket_type_badge.short_description = 'Type'

    def status_badge(self, obj):
        colors = {
            'open': '#3b82f6',
            'in_progress': '#eab308',
            'waiting_response': '#f97316',
            'resolved': '#22c55e',
            'closed': '#6b7280',
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            colors.get(obj.status, '#6b7280'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def priority_badge(self, obj):
        colors = {
            'low': '#22c55e',
            'medium': '#eab308',
            'high': '#f97316',
            'urgent': '#ef4444',
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            colors.get(obj.priority, '#6b7280'),
            obj.get_priority_display()
        )
    priority_badge.short_description = 'Priority'

    def comment_count(self, obj):
        count = obj.comments.count()
        if count > 0:
            return format_html('<span style="color: #0a61ae; font-weight: 600;">{}</span>', count)
        return '-'
    comment_count.short_description = 'Comments'

    actions = ['mark_in_progress', 'mark_resolved', 'mark_closed', 'assign_to_me']

    @admin.action(description='Mark as In Progress')
    def mark_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'{updated} ticket(s) marked as in progress.')

    @admin.action(description='Mark as Resolved')
    def mark_resolved(self, request, queryset):
        updated = queryset.update(status='resolved', resolved_at=timezone.now())
        self.message_user(request, f'{updated} ticket(s) marked as resolved.')

    @admin.action(description='Mark as Closed')
    def mark_closed(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(request, f'{updated} ticket(s) closed.')

    @admin.action(description='Assign to me')
    def assign_to_me(self, request, queryset):
        updated = queryset.update(assigned_to=request.user)
        self.message_user(request, f'{updated} ticket(s) assigned to you.')


@admin.register(TicketComment)
class TicketCommentAdmin(admin.ModelAdmin):
    list_display = ['ticket_link', 'user', 'comment_preview', 'is_internal_badge', 'created_at']
    list_filter = ['is_internal', 'created_at']
    search_fields = ['comment', 'ticket__title', 'user__username']
    readonly_fields = ['created_at', 'updated_at']

    def ticket_link(self, obj):
        return format_html('<strong>#{}</strong> {}', obj.ticket.id, obj.ticket.title)
    ticket_link.short_description = 'Ticket'

    def comment_preview(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = 'Comment'

    def is_internal_badge(self, obj):
        if obj.is_internal:
            return format_html('<span style="color: #ef4444;">● Internal</span>')
        return format_html('<span style="color: #22c55e;">● Public</span>')
    is_internal_badge.short_description = 'Visibility'


@admin.register(ProjectFile)
class ProjectFileAdmin(admin.ModelAdmin):
    list_display = ['name', 'project', 'category_badge', 'file_size_display', 'uploaded_by', 'is_confidential_badge', 'created_at']
    list_filter = ['category', 'is_confidential', 'created_at']
    search_fields = ['name', 'description', 'project__title']
    readonly_fields = ['file_size', 'created_at', 'updated_at']

    fieldsets = (
        ('File Information', {
            'fields': ('project', 'name', 'description', 'file', 'category')
        }),
        ('Security', {
            'fields': ('is_confidential', 'uploaded_by')
        }),
        ('Metadata', {
            'fields': ('file_size', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def category_badge(self, obj):
        icons = {
            'document': '📄',
            'image': '🖼️',
            'video': '🎥',
            'design': '🎨',
            'code': '💻',
            'other': '📎',
        }
        return format_html(
            '<span>{} {}</span>',
            icons.get(obj.category, ''),
            obj.get_category_display()
        )
    category_badge.short_description = 'Category'

    def is_confidential_badge(self, obj):
        if obj.is_confidential:
            return format_html('<span style="color: #ef4444;">🔒 Confidential</span>')
        return format_html('<span style="color: #22c55e;">🔓 Public</span>')
    is_confidential_badge.short_description = 'Access'


@admin.register(EmailPreferences)
class EmailPreferencesAdmin(admin.ModelAdmin):
    list_display = ['user', 'project_updates', 'ticket_comments', 'ticket_status_changes', 'new_files', 'weekly_summary', 'updated_at']
    list_filter = ['project_updates', 'ticket_comments', 'ticket_status_changes', 'new_files', 'weekly_summary']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Email Notification Settings', {
            'fields': ('project_updates', 'ticket_comments', 'ticket_status_changes', 'new_files', 'weekly_summary'),
            'description': 'Control which email notifications the user receives'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status_badge', 'target_date', 'completed_date', 'overdue_badge', 'order']
    list_filter = ['status', 'target_date', 'project']
    search_fields = ['title', 'description', 'project__title']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['order']

    fieldsets = (
        ('Milestone Information', {
            'fields': ('project', 'title', 'description', 'status', 'order')
        }),
        ('Timeline', {
            'fields': ('target_date', 'completed_date')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        colors = {
            'pending': '#6b7280',
            'in_progress': '#3b82f6',
            'completed': '#22c55e',
            'delayed': '#ef4444',
        }
        return format_html(
            '<span style="color: {}; font-weight: 600;">● {}</span>',
            colors.get(obj.status, '#6b7280'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def overdue_badge(self, obj):
        if obj.is_overdue:
            return format_html('<span style="color: #ef4444; font-weight: 600;">⚠️ Overdue</span>')
        return format_html('<span style="color: #22c55e;">✓ On Track</span>')
    overdue_badge.short_description = 'Timeline'

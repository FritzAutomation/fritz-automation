from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ClientProfile, ClientProject, ProjectUpdate, Ticket, TicketComment, ProjectFile, EmailPreferences, ProjectMilestone


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class ClientProfileSerializer(serializers.ModelSerializer):
    """Serializer for ClientProfile model"""
    user = UserSerializer(read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = ClientProfile
        fields = ['id', 'user', 'company_name', 'phone', 'address', 'avatar', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_avatar(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class ProjectUpdateSerializer(serializers.ModelSerializer):
    """Serializer for ProjectUpdate model"""
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = ProjectUpdate
        fields = ['id', 'project', 'title', 'description', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_at']


class TicketCommentSerializer(serializers.ModelSerializer):
    """Serializer for TicketComment model"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = TicketComment
        fields = ['id', 'ticket', 'user', 'comment', 'is_internal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Automatically set the user from request
        request = self.context.get('request')
        if request and request.user:
            validated_data['user'] = request.user
        return super().create(validated_data)


class TicketListSerializer(serializers.ModelSerializer):
    """Serializer for Ticket list view (less detailed)"""
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'id', 'project', 'project_title', 'title', 'ticket_type',
            'status', 'priority', 'created_by', 'assigned_to',
            'created_at', 'updated_at', 'comment_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_comment_count(self, obj):
        return obj.comments.count()


class TicketDetailSerializer(serializers.ModelSerializer):
    """Serializer for Ticket detail view (more detailed)"""
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    comments = TicketCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'project', 'project_title', 'title', 'description',
            'ticket_type', 'status', 'priority', 'created_by',
            'assigned_to', 'created_at', 'updated_at', 'resolved_at', 'comments'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Automatically set created_by from request
        request = self.context.get('request')
        if request and request.user:
            validated_data['created_by'] = request.user
        return super().create(validated_data)


class ProjectFileSerializer(serializers.ModelSerializer):
    """Serializer for ProjectFile model"""
    uploaded_by = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    file_size_display = serializers.ReadOnlyField()

    class Meta:
        model = ProjectFile
        fields = [
            'id', 'project', 'name', 'description', 'file', 'file_url',
            'category', 'file_size', 'file_size_display', 'is_confidential',
            'uploaded_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'file_size', 'created_at', 'updated_at']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def validate_file(self, value):
        """Validate file size and type"""
        # Maximum file size: 50MB
        max_size = 50 * 1024 * 1024  # 50MB in bytes

        if value.size > max_size:
            raise serializers.ValidationError(
                f'File size must be less than 50MB. Your file is {value.size / (1024 * 1024):.1f}MB.'
            )

        # Optional: Add file type validation
        # allowed_extensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.png', '.jpg', '.jpeg']
        # ext = os.path.splitext(value.name)[1].lower()
        # if ext not in allowed_extensions:
        #     raise serializers.ValidationError(f'File type {ext} is not allowed.')

        return value

    def create(self, validated_data):
        # Automatically set uploaded_by from request
        request = self.context.get('request')
        if request and request.user:
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    """Serializer for ProjectMilestone model"""
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = ProjectMilestone
        fields = ['id', 'project', 'title', 'description', 'status', 'target_date', 'completed_date', 'order', 'is_overdue', 'created_at', 'updated_at']
        read_only_fields = ['id', 'is_overdue', 'created_at', 'updated_at']


class ClientProjectListSerializer(serializers.ModelSerializer):
    """Serializer for ClientProject list view (less detailed)"""
    client = UserSerializer(read_only=True)
    open_tickets_count = serializers.SerializerMethodField()
    files_count = serializers.SerializerMethodField()

    class Meta:
        model = ClientProject
        fields = [
            'id', 'title', 'slug', 'status', 'priority', 'client',
            'progress_percentage', 'start_date', 'estimated_completion',
            'open_tickets_count', 'files_count', 'created_at', 'last_activity'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'last_activity']

    def get_open_tickets_count(self, obj):
        return obj.tickets.exclude(status__in=['resolved', 'closed']).count()

    def get_files_count(self, obj):
        return obj.files.count()


class ClientProjectDetailSerializer(serializers.ModelSerializer):
    """Serializer for ClientProject detail view (more detailed)"""
    client = UserSerializer(read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)
    tickets = TicketListSerializer(many=True, read_only=True)
    files = ProjectFileSerializer(many=True, read_only=True)
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    open_tickets_count = serializers.SerializerMethodField()

    class Meta:
        model = ClientProject
        fields = [
            'id', 'client', 'title', 'slug', 'description', 'status',
            'priority', 'start_date', 'estimated_completion', 'actual_completion',
            'deliverables', 'progress_percentage', 'staging_url',
            'production_url', 'repository_url', 'created_at', 'updated_at',
            'last_activity', 'updates', 'tickets', 'files', 'milestones', 'open_tickets_count'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'last_activity']

    def get_open_tickets_count(self, obj):
        return obj.tickets.exclude(status__in=['resolved', 'closed']).count()


# Authentication Serializers
class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    company_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'company_name', 'phone']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        company_name = validated_data.pop('company_name', '')
        phone = validated_data.pop('phone', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        # Create client profile
        ClientProfile.objects.create(
            user=user,
            company_name=company_name,
            phone=phone
        )

        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_projects = serializers.IntegerField()
    active_projects = serializers.IntegerField()
    open_tickets = serializers.IntegerField()
    recent_updates_count = serializers.IntegerField()


class EmailPreferencesSerializer(serializers.ModelSerializer):
    """Serializer for EmailPreferences model"""
    class Meta:
        model = EmailPreferences
        fields = ['id', 'project_updates', 'ticket_comments', 'ticket_status_changes', 'new_files', 'weekly_summary', 'updated_at']
        read_only_fields = ['id', 'updated_at']

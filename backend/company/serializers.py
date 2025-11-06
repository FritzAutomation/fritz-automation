from rest_framework import serializers
from .models import Skill, WorkExperience, Project, ContactMessage, SiteSettings


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'icon', 'proficiency', 'order', 'is_active']


class WorkExperienceSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = WorkExperience
        fields = [
            'id', 'company', 'position', 'location',
            'start_date', 'end_date', 'description',
            'image', 'is_current', 'duration', 'order'
        ]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProjectListSerializer(serializers.ModelSerializer):
    """Serializer for project list view (less detailed)"""
    technologies = SkillSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description',
            'image', 'status', 'technologies', 'featured'
        ]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Serializer for project detail view (more detailed)"""
    technologies = SkillSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'description',
            'image', 'github_url', 'live_url', 'status',
            'technologies', 'featured', 'created_at', 'updated_at'
        ]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message']
        read_only_fields = ['id']

    def create(self, validated_data):
        # Add IP address and user agent from request context
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = self.get_client_ip(request)
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        return super().create(validated_data)

    @staticmethod
    def get_client_ip(request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SiteSettingsSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    resume_file = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'site_title', 'tagline', 'about_text', 'hero_image',
            'resume_file', 'github_url', 'linkedin_url',
            'twitter_url', 'email', 'meta_description', 'meta_keywords'
        ]

    def get_hero_image(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return None

    def get_resume_file(self, obj):
        if obj.resume_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_file.url)
            return obj.resume_file.url
        return None

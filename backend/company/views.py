from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from drf_spectacular.utils import extend_schema
import logging

from .models import Skill, WorkExperience, Project, ContactMessage, SiteSettings
from .serializers import (
    SkillSerializer, WorkExperienceSerializer,
    ProjectListSerializer, ProjectDetailSerializer,
    ContactMessageSerializer, SiteSettingsSerializer
)
from .emails import send_contact_form_email

logger = logging.getLogger(__name__)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing skills.
    Only active skills are returned.
    """
    queryset = Skill.objects.filter(is_active=True)
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Disable pagination for skills

    @extend_schema(
        summary="List skills by category",
        description="Returns skills grouped by category"
    )
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Return skills grouped by category"""
        categories = {}
        skills = self.get_queryset()

        for skill in skills:
            category = skill.get_category_display()
            if category not in categories:
                categories[category] = []
            categories[category].append(SkillSerializer(skill).data)

        return Response(categories)


class WorkExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing work experience.
    """
    queryset = WorkExperience.objects.all()
    serializer_class = WorkExperienceSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Disable pagination for work experience


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing projects.
    """
    queryset = Project.objects.filter(status__in=['completed', 'in_progress'])
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    pagination_class = None  # Disable pagination for projects

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

    @extend_schema(
        summary="List featured projects",
        description="Returns only featured projects"
    )
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Return only featured projects"""
        featured_projects = self.get_queryset().filter(featured=True)
        serializer = ProjectListSerializer(featured_projects, many=True)
        return Response(serializer.data)


class ContactThrottle(AnonRateThrottle):
    """Custom throttle for contact form submissions"""
    rate = '5/hour'


class ContactMessageViewSet(viewsets.GenericViewSet):
    """
    API endpoint for creating contact messages.
    Only creation is allowed (no listing or updating).
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ContactThrottle]

    @extend_schema(
        summary="Submit contact message",
        description="Submit a contact form message"
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        contact_message = serializer.save()

        # Send email notification
        try:
            send_contact_form_email(contact_message)
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Error sending contact form email: {e}", exc_info=True)

        return Response(
            {'message': 'Thank you for your message! We will get back to you soon.'},
            status=status.HTTP_201_CREATED
        )


class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing site settings.
    Returns the singleton site settings object.
    """
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        """Return the singleton site settings"""
        settings = SiteSettings.load()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)

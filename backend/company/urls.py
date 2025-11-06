from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SkillViewSet, WorkExperienceViewSet, ProjectViewSet,
    ContactMessageViewSet, SiteSettingsViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'work-experience', WorkExperienceViewSet, basename='work-experience')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'settings', SiteSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
]

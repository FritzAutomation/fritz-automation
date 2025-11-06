from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientProjectViewSet, TicketViewSet, ProjectFileViewSet,
    ClientProfileViewSet, EmailPreferencesViewSet, register, login, logout,
    dashboard_stats, recent_activity
)

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'projects', ClientProjectViewSet, basename='client-project')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'files', ProjectFileViewSet, basename='project-file')
router.register(r'profile', ClientProfileViewSet, basename='client-profile')
router.register(r'email-preferences', EmailPreferencesViewSet, basename='email-preferences')

app_name = 'portal'

urlpatterns = [
    # Auth endpoints
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),

    # Dashboard endpoints
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('dashboard/activity/', recent_activity, name='recent-activity'),

    # Router URLs (projects, tickets, files, profile)
    path('', include(router.urls)),
]

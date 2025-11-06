from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from .models import ClientProfile, ClientProject, ProjectUpdate, Ticket, TicketComment, ProjectFile, EmailPreferences
from .serializers import (
    ClientProfileSerializer, ClientProjectListSerializer, ClientProjectDetailSerializer,
    ProjectUpdateSerializer, TicketListSerializer, TicketDetailSerializer,
    TicketCommentSerializer, ProjectFileSerializer, RegisterSerializer,
    LoginSerializer, DashboardStatsSerializer, UserSerializer, EmailPreferencesSerializer
)


class AuthThrottle(AnonRateThrottle):
    """Custom throttle for authentication endpoints"""
    rate = '10/hour'


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_staff:
            return True

        # Check if the object has a client field
        if hasattr(obj, 'client'):
            return obj.client == request.user

        # Check if the object has a created_by field
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user

        # Check if the object is a ClientProfile
        if isinstance(obj, ClientProfile):
            return obj.user == request.user

        return False


class ClientProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Client Projects
    """
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        # Admin can see all projects, clients only see their own
        if self.request.user.is_staff:
            return ClientProject.objects.all()
        return ClientProject.objects.filter(client=self.request.user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClientProjectDetailSerializer
        return ClientProjectListSerializer

    @action(detail=True, methods=['post'])
    def add_update(self, request, pk=None):
        """Add a project update"""
        project = self.get_object()
        serializer = ProjectUpdateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(project=project, created_by=request.user)
            # Update project's last_activity
            project.last_activity = timezone.now()
            project.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Tickets
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin can see all tickets
        if self.request.user.is_staff:
            queryset = Ticket.objects.all()
        else:
            # Clients see tickets they created or that belong to their projects
            queryset = Ticket.objects.filter(
                created_by=self.request.user
            ) | Ticket.objects.filter(
                project__client=self.request.user
            )

        # Filter by project if specified
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        # Filter by status if specified
        ticket_status = self.request.query_params.get('status')
        if ticket_status:
            queryset = queryset.filter(status=ticket_status)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TicketDetailSerializer
        return TicketListSerializer

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add a comment to a ticket"""
        ticket = self.get_object()
        serializer = TicketCommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(ticket=ticket, user=request.user)
            # Update ticket's updated_at
            ticket.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark a ticket as resolved"""
        ticket = self.get_object()
        ticket.status = 'resolved'
        ticket.resolved_at = timezone.now()
        ticket.save()
        serializer = self.get_serializer(ticket)
        return Response(serializer.data)


class ProjectFileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Project Files
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProjectFileSerializer

    def get_queryset(self):
        # Admin can see all files
        if self.request.user.is_staff:
            queryset = ProjectFile.objects.all()
        else:
            # Clients see files from their projects
            queryset = ProjectFile.objects.filter(project__client=self.request.user)

        # Filter by project if specified
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        """Set uploaded_by to current user"""
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download a file"""
        from django.http import FileResponse, Http404

        file_obj = self.get_object()

        try:
            response = FileResponse(file_obj.file.open('rb'))
            response['Content-Disposition'] = f'attachment; filename="{file_obj.name}"'
            return response
        except FileNotFoundError:
            raise Http404("File not found")


class ClientProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Client Profiles (read-only)
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClientProfileSerializer

    def get_queryset(self):
        # Users can only see their own profile
        return ClientProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        profile, created = ClientProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([AuthThrottle])
def register(request):
    """
    Register a new client user
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([AuthThrottle])
def login(request):
    """
    Login a user and return auth token
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """
    Logout a user by deleting their auth token
    """
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """
    Get dashboard statistics for the logged-in client
    """
    user = request.user

    if user.is_staff:
        # Admin sees all stats
        total_projects = ClientProject.objects.count()
        active_projects = ClientProject.objects.filter(status='in_progress').count()
        open_tickets = Ticket.objects.exclude(status__in=['resolved', 'closed']).count()
    else:
        # Client sees their own stats
        total_projects = ClientProject.objects.filter(client=user).count()
        active_projects = ClientProject.objects.filter(client=user, status='in_progress').count()
        open_tickets = Ticket.objects.filter(
            created_by=user
        ).exclude(status__in=['resolved', 'closed']).count()

    # Recent updates (last 7 days)
    seven_days_ago = timezone.now() - timedelta(days=7)
    if user.is_staff:
        recent_updates = ProjectUpdate.objects.filter(created_at__gte=seven_days_ago).count()
    else:
        recent_updates = ProjectUpdate.objects.filter(
            project__client=user,
            created_at__gte=seven_days_ago
        ).count()

    stats = {
        'total_projects': total_projects,
        'active_projects': active_projects,
        'open_tickets': open_tickets,
        'recent_updates_count': recent_updates
    }

    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recent_activity(request):
    """
    Get recent activity for the logged-in client
    """
    user = request.user

    # Get recent project updates
    if user.is_staff:
        updates = ProjectUpdate.objects.all()[:10]
        tickets = Ticket.objects.all()[:10]
    else:
        updates = ProjectUpdate.objects.filter(project__client=user)[:10]
        tickets = Ticket.objects.filter(created_by=user)[:10]

    return Response({
        'updates': ProjectUpdateSerializer(updates, many=True, context={'request': request}).data,
        'tickets': TicketListSerializer(tickets, many=True, context={'request': request}).data
    })


class EmailPreferencesViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing email notification preferences
    """
    serializer_class = EmailPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Users can only access their own email preferences"""
        return EmailPreferences.objects.filter(user=self.request.user)

    def get_object(self):
        """Get or create email preferences for the current user"""
        obj, created = EmailPreferences.objects.get_or_create(user=self.request.user)
        return obj

    def list(self, request, *args, **kwargs):
        """Return the user's email preferences"""
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Update the user's email preferences"""
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

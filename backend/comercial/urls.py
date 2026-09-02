from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EjecutivoViewSet,
    ClienteViewSet,
    ReunionViewSet,
    PropuestaViewSet,
    ProyectoViewSet,
    dashboard,
)
from .views_auth import RegisterView, LoginView, LogoutView, CurrentUserView

router = DefaultRouter()
router.register(r'ejecutivos', EjecutivoViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'reuniones', ReunionViewSet)
router.register(r'propuestas', PropuestaViewSet)
router.register(r'proyectos', ProyectoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard, name='dashboard'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/user/', CurrentUserView.as_view(), name='auth-user'),
]
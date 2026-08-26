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

router = DefaultRouter()
router.register(r'ejecutivos', EjecutivoViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'reuniones', ReunionViewSet)
router.register(r'propuestas', PropuestaViewSet)
router.register(r'proyectos', ProyectoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard, name='dashboard'),
]
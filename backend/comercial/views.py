from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Sum
from .models import Ejecutivo, Cliente, Reunion, Propuesta, Proyecto
from .serializers import (
    EjecutivoSerializer,
    ClienteSerializer,
    ReunionSerializer,
    PropuestaSerializer,
    ProyectoSerializer,
)
from .permissions import EsEjecutivoOrReadOnly, AutenticadoPuedeEditar


class EjecutivoViewSet(viewsets.ModelViewSet):
    queryset = Ejecutivo.objects.all()
    serializer_class = EjecutivoSerializer
    permission_classes = [EsEjecutivoOrReadOnly]


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.select_related('id_ejecutivo').all()
    serializer_class = ClienteSerializer
    permission_classes = [EsEjecutivoOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        ejecutivo_id = self.request.query_params.get('ejecutivo')
        if ejecutivo_id:
            queryset = queryset.filter(id_ejecutivo_id=ejecutivo_id)
        return queryset


class ReunionViewSet(viewsets.ModelViewSet):
    queryset = Reunion.objects.select_related('id_cliente').all()
    serializer_class = ReunionSerializer
    permission_classes = [EsEjecutivoOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente_id = self.request.query_params.get('cliente')
        if cliente_id:
            queryset = queryset.filter(id_cliente_id=cliente_id)
        return queryset


class PropuestaViewSet(viewsets.ModelViewSet):
    queryset = Propuesta.objects.select_related('id_cliente').all()
    serializer_class = PropuestaSerializer
    permission_classes = [AutenticadoPuedeEditar]

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente_id = self.request.query_params.get('cliente')
        estado = self.request.query_params.get('estado')
        if cliente_id:
            queryset = queryset.filter(id_cliente_id=cliente_id)
        if estado:
            queryset = queryset.filter(estado=estado)
        return queryset


class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.select_related('id_cliente', 'id_propuesta').all()
    serializer_class = ProyectoSerializer
    permission_classes = [AutenticadoPuedeEditar]

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente_id = self.request.query_params.get('cliente')
        estado = self.request.query_params.get('estado')
        if cliente_id:
            queryset = queryset.filter(id_cliente_id=cliente_id)
        if estado:
            queryset = queryset.filter(estado=estado)
        return queryset


@api_view(['GET'])
def dashboard(request):
    data = {
        'total_ejecutivos': Ejecutivo.objects.count(),
        'total_clientes': Cliente.objects.count(),
        'total_reuniones': Reunion.objects.count(),
        'total_propuestas': Propuesta.objects.count(),
        'total_proyectos': Proyecto.objects.count(),
        'propuestas_por_estado': list(
            Propuesta.objects.values('estado')
            .annotate(total=Count('id_propuesta'))
        ),
        'proyectos_por_estado': list(
            Proyecto.objects.values('estado')
            .annotate(total=Count('id_proyecto'))
        ),
        'monto_total_propuestas': Propuesta.objects.aggregate(
            total=Sum('monto')
        )['total'] or 0,
        'monto_total_proyectos': Proyecto.objects.aggregate(
            total=Sum('presupuesto')
        )['total'] or 0,
    }
    return Response(data)
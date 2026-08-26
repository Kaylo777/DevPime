from rest_framework import serializers
from .models import Ejecutivo, Cliente, Reunion, Propuesta, Proyecto


class EjecutivoSerializer(serializers.ModelSerializer):
    total_clientes = serializers.SerializerMethodField()

    class Meta:
        model = Ejecutivo
        fields = '__all__'

    def get_total_clientes(self, obj):
        return obj.clientes.count()


class ClienteSerializer(serializers.ModelSerializer):
    nombre_ejecutivo = serializers.SerializerMethodField()
    total_reuniones = serializers.SerializerMethodField()
    total_propuestas = serializers.SerializerMethodField()
    total_proyectos = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = '__all__'

    def get_nombre_ejecutivo(self, obj):
        return f"{obj.id_ejecutivo.nombre} {obj.id_ejecutivo.apellido}"

    def get_total_reuniones(self, obj):
        return obj.reuniones.count()

    def get_total_propuestas(self, obj):
        return obj.propuestas.count()

    def get_total_proyectos(self, obj):
        return obj.proyectos.count()


class ReunionSerializer(serializers.ModelSerializer):
    nombre_cliente = serializers.SerializerMethodField()

    class Meta:
        model = Reunion
        fields = '__all__'

    def get_nombre_cliente(self, obj):
        return f"{obj.id_cliente.nombre} {obj.id_cliente.apellido}"


class PropuestaSerializer(serializers.ModelSerializer):
    nombre_cliente = serializers.SerializerMethodField()

    class Meta:
        model = Propuesta
        fields = '__all__'

    def get_nombre_cliente(self, obj):
        return f"{obj.id_cliente.nombre} {obj.id_cliente.apellido}"


class ProyectoSerializer(serializers.ModelSerializer):
    nombre_cliente = serializers.SerializerMethodField()
    titulo_propuesta = serializers.SerializerMethodField()

    class Meta:
        model = Proyecto
        fields = '__all__'

    def get_nombre_cliente(self, obj):
        return f"{obj.id_cliente.nombre} {obj.id_cliente.apellido}"

    def get_titulo_propuesta(self, obj):
        if obj.id_propuesta:
            return obj.id_propuesta.titulo
        return None
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Ejecutivo, Cliente, Reunion, Propuesta, Proyecto


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'rol', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'rol')}),
        ('Vinculaciones', {'fields': ('id_ejecutivo', 'id_cliente')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'rol', 'password1', 'password2'),
        }),
    )


@admin.register(Ejecutivo)
class EjecutivoAdmin(admin.ModelAdmin):
    list_display = ('id_ejecutivo', 'nombre', 'apellido', 'email', 'telefono', 'cargo')
    search_fields = ('nombre', 'apellido', 'email')


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id_cliente', 'nombre', 'apellido', 'email', 'empresa', 'id_ejecutivo')
    search_fields = ('nombre', 'apellido', 'email', 'empresa')
    list_filter = ('id_ejecutivo',)


@admin.register(Reunion)
class ReunionAdmin(admin.ModelAdmin):
    list_display = ('id_reunion', 'titulo', 'id_cliente', 'fecha_reunion', 'lugar')
    search_fields = ('titulo',)
    list_filter = ('fecha_reunion',)


@admin.register(Propuesta)
class PropuestaAdmin(admin.ModelAdmin):
    list_display = ('id_propuesta', 'titulo', 'id_cliente', 'monto', 'estado', 'fecha_creacion')
    search_fields = ('titulo',)
    list_filter = ('estado',)


@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display = ('id_proyecto', 'nombre', 'id_cliente', 'id_propuesta', 'estado', 'fecha_inicio', 'fecha_fin')
    search_fields = ('nombre',)
    list_filter = ('estado',)
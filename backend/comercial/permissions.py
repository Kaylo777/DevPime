from rest_framework import permissions


class EsEjecutivoOrReadOnly(permissions.BasePermission):
    """Permite lectura a cualquier usuario autenticado; solo ejecutivos (o staff) pueden escribir."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and (
            request.user.is_staff or request.user.rol == 'ejecutivo'
        )


class AutenticadoPuedeEditar(permissions.BasePermission):
    """Cualquier usuario autenticado (cliente o ejecutivo) puede leer y escribir."""

    def has_permission(self, request, view):
        return request.user.is_authenticated

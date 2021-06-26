from rest_framework import permissions
from groot.models import Room


class CanAccessRoom(permissions.BasePermission):
    """
        This permission grants a user access to a given room
    """
    def has_object_permission(self, request, view, obj):
        return (request.user in obj.participants.all())

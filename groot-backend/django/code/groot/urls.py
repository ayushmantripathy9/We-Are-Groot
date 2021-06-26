"""
    URLs to be mapped to for api requests to the backend
    
"""
from rest_framework import routers, urlpatterns
from django.urls import path

from groot.views import *

router = routers.SimpleRouter()

# here the urls of the backend are mapped to various viewsets

router.register(r'auth', AuthViewSet, basename="auth")
router.register(r'room', RoomViewSet, basename="room")

urlpatterns = []
urlpatterns += router.urls
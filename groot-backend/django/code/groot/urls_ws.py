"""
    URLs to be mapped to for web-socket connections (ws requests)

"""
from django.urls import re_path

# import all the web-socket consumers
from . import consumers 

websocket_urlpatterns = [
    re_path(r'ws/rooms/(?P<room_code>\w+)/call/$', consumers.CallConsumer.as_asgi()),
]

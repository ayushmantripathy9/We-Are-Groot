import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class CallConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__()

    def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']

        try:
            async_to_sync(self.channel_layer.group_add)(
                f'call-{self.room_code}', self.channel_name
            )
            
            self.accept()

            print("channel_layer: ",self.channel_layer,"channel_name" ,self.channel_name)


        except:
            print("Error ocurred while setting up ws-connection")
            self.close()

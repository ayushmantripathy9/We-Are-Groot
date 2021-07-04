import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from groot.consumers.messageTypes import signalling_events

from groot.models import Room

from groot.serializers import UserGetSerializer


class SignallingConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__()

    def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.user = self.scope['user']

        self.call_group_name = f'call-{self.room_code}' 

        try:
            room = Room.objects.get(room_code=self.room_code)

            async_to_sync(self.channel_layer.group_add)(
                self.call_group_name, 
                self.channel_name
            )

            self.accept()

        except Room.DoesNotExist:
            print("No such room exists")
            self.close()

    def disconnect(self, code):

        async_to_sync(self.channel_layer.group_discard)(
            self.call_group_name,
            self.channel_name
        )


    def receive(self, text_data):
        received_data = json.loads(text_data)
        type = received_data.get('type')
        data = received_data.get('data')

        if not type or not data:
            return

        if type in signalling_events.specific_user_messages:
            message_data = {
                'type': type,
                'data': data
            }

            async_to_sync(self.channel_layer.group_send)(
                self.call_group_name,
                {
                    'type': "send_message_to_user",
                    'message': message_data
                }
            )
    

    def send_message_to_all(self, event):
        """
            To send message to all the users in the channel using the web-socket
        """        
        message = event['message']
        self.send(text_data=json.dumps(message))

    
    def send_message_to_user(self, event):
        """
            To send message to a specific user using the web-socket
        """
        message = event['message']
        
        if(str(self.user.id) == str(message['data']['targetID'])):
            self.send(
                text_data=json.dumps(message)
            )
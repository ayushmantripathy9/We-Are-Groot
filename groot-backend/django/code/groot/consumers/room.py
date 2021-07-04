import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from groot.consumers.messageTypes import room_events

from groot.models import Room

from groot.serializers import UserGetSerializer

class RoomConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__()

    def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.user = self.scope['user']

        self.room_group_name = f'room-{self.room_code}' 

        try:
            room = Room.objects.get(room_code=self.room_code)

            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name, 
                self.channel_name
            )

            self.accept()

            room_participants = UserGetSerializer(room.participants.all(), many=True).data

            message_data = {
                'type': room_events.ROOM_PARTICIPANTS,
                'data': room_participants
            }
            
            self.send(text_data=json.dumps(message_data))

            message_data = {
                'type': room_events.USER_JOINED,
                'data': UserGetSerializer(self.user).data
            }

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': "send_message_to_all",
                    'message': message_data
                }
            )

        except Room.DoesNotExist:
            print("No such room exists")
            self.close()

    def disconnect(self, code):
        message_data = {
            'type': room_events.USER_LEFT,
            'data': UserGetSerializer(self.user).data
        }

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':"send_message_to_all",
                'message': message_data
            }
        )

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

        self.close()
        
    def receive(self, text_data):
        received_data = json.loads(text_data)
        type = received_data.get('type')
        data = received_data.get('message')

        message_data = {
            'type': type,
            'data': data
        }

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': "send_message_to_all",
                'message': message_data
            }
        )
    
    def send_message_to_all(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
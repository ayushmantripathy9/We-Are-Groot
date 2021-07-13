import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from groot.consumers.messageTypes import room_events

from groot.models import Room

from groot.serializers import UserGetSerializer

class RoomConsumer(WebsocketConsumer):
    """
        Consumer that handles all the web-socket messages pertaining to Room
        It handles events such as USER_JOINED, USER_LEFT and ROOM_PARTICIPANTS

        Methods:
            - connect()
                This is invoked when a new user connects to the chat web-socket, on joining the room
                It sends the user, all the room participants currently in the room
                This also sends a burst message to everyone in the room, that a new user has joined
            
            - disconnect( string : code )
                This method is invoked when a user leaves the room and thus disconnects from the room web-socket
                It also notifies every user in the room via a burst event that the user has left the meeting
            
            - receive( stringified_json : text_data )
                Whenever a user sends a message to the web-socket, it invokes this method
                For the room ws, this method on receiving any message from the user, sends the message as a burst to all the users in the room
                This is just a utility method present in the Room Consumer
            
            - send_message_to_all( dict : event)
                This is a utility method of the class used to send a burst message in the room
                (Sends message to all users in the room)
                
    """
    def __init__(self, *args, **kwargs):
        super().__init__()

    def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.user = self.scope['user']

        self.room_group_name = f'room-{self.room_code}' 

        try:
            room = Room.objects.get(room_code=self.room_code)
            self.room = room

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

        self.room.participants.remove(self.user)

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
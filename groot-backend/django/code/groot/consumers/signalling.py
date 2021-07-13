import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from groot.consumers.messageTypes import signalling_events

from groot.models import Room

from groot.serializers import UserGetSerializer


class SignallingConsumer(WebsocketConsumer):
    """
        Consumer that handles all the web-socket messages pertaining to Video Call Signalling using WebRTC
        It handles events such as CALL_CONNECTED, PARTICIPANT_LEFT and signalling events such as OFFER, ANSWER, ICE_CANDIDATE
        
        Methods:
            - connect()
                This is invoked when a new user connects to the signalling web-socket, on joining the room
                It sends the user who joined, a message containing all the room participants currently in the room
            
            - disconnect( string : code )
                This method is invoked when a user leaves the room and thus disconnects from the signalling web-socket
                It also notifies every user in the room via a burst event that the user has left the meeting in order to update the participants list
            
            - receive( stringified_json : text_data )
                Whenever a user sends a signalling message to the web-socket, it invokes this method
                For the signalling ws, this method on receiving any message from the user, sends the message in two ways:
                    - If the message_type is in "specific_user_messages":
                        The message is sent to a specific user
                        Events: OFFER, ANSWER, ICE_CANDIDATE trigger this
                    - Else:
                        The message is sent as a burst message to all users in the room
                        Event: PARTICIPANT_LEFT
            
            - send_message_to_all( dict : event)
                This is the utility method of the class used to send a burst message in the room
                (Sends message to all users in the room)

            - send_message_to_user( dict : event)
                This is the utility method of the class used to send the message to a specific user of the room

    """
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

            message_data = {
                'type': signalling_events.CALL_CONNECTED,
                'data': UserGetSerializer(room.participants.all(), many=True).data
            }

            self.send(text_data=json.dumps(message_data))

        except Room.DoesNotExist:
            print("No such room exists")
            self.close()

    def disconnect(self, code):
        message_data = {
            'type': signalling_events.PARTICIPANT_LEFT,
            'data': UserGetSerializer(self.user).data
        }
        async_to_sync(self.channel_layer.group_send)(
            self.call_group_name,
            {
                'type':"send_message_to_all",
                'message': message_data
            }
        )
        async_to_sync(self.channel_layer.group_discard)(
            self.call_group_name,
            self.channel_name
        )

        self.close()

    def receive(self, text_data):
        received_data = json.loads(text_data)
        type = received_data.get('type')
        data = received_data.get('message')

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
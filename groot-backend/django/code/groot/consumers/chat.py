import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from groot.consumers.messageTypes import chat_events
from groot.models import Message, Room
from groot.serializers import MessageGetSerializer

class ChatConsumer(WebsocketConsumer):
    """
        Consumer that handles all the web-socket messages pertaining to Room Chat
        This consumer also handles the ws requests during room-history to send the room-chat history to the frontend

        Methods:
            - connect()
                This is invoked when a new user connects to the chat web-socket, on joining the room
                It sends the user the past messages sent in the room-chat before the user joined
            
            - disconnect( string : code )
                This method is invoked when a user leaves the room and thus disconnects from the room's chat web-socket
                When the room selection is changed in the Room History page, then also this method is invoked
            
            - receive( stringified_json : text_data )
                Whenever a user sends a message to the web-socket, it invokes this method
                For the chat ws, this method on receiving any message from the user, sends the message as a burst to all the users in the room
                Thus, all new messages sent in the Room Chat once the user has joined are handled by the receive() method
            
            - send_message_to_all( dict : event)
                This is a utility method of the class used to send a burst message in the room
                (Sends message to all users in the room)
                
    """

    def __init__(self, *args, **kwargs):
        super().__init__()

    def connect(self):    
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.user = self.scope['user']

        self.chat_group_name = f'chat-{self.room_code}'
        try:
            room = Room.objects.get(room_code=self.room_code)

            async_to_sync(self.channel_layer.group_add)(
                self.chat_group_name, 
                self.channel_name
            )

            self.accept()

            room_messages = Message.objects.filter(room_id=room.id).order_by('time_sent')

            message_data = {
                'type': chat_events.MESSAGES_SENT_BEFORE,
                'data': MessageGetSerializer(room_messages, many=True).data
            }

            self.send(text_data=json.dumps(message_data))

        
        except Room.DoesNotExist:
            print("No such room exists")
            self.close()

    def disconnect(self, code):
        self.user = self.scope['user']

        async_to_sync(self.channel_layer.group_discard)(
            self.chat_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        received_data = json.loads(text_data)
        type = received_data.get('type')
        content = received_data.get('content')
        
        if(content):
            try:
                room = Room.objects.get(room_code=self.room_code)

                message = Message(
                    sender=self.user,
                    content=content,
                    room=room
                )
                message.save()

                serializer = MessageGetSerializer(message)

                async_to_sync(self.channel_layer.group_send)(
                    self.chat_group_name,
                    {
                        'type': "send_message_to_all",
                        'message': {
                            'type': chat_events.NEW_MESSAGE,
                            'data': serializer.data
                        }
                    }
                )

            except:
                self.close()

        elif(type == chat_events.GET_MESSAGES_SENT_BEFORE):
            room_messages = Message.objects.filter(room_code=self.room_code).order_by('time_sent')

            message_data = {
                'type': chat_events.MESSAGES_SENT_BEFORE,
                'data': MessageGetSerializer(room_messages, many=True).data
            }

            self.send(text_data=json.dumps(message_data))

        else:
            pass        

    
    def send_message_to_all(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))


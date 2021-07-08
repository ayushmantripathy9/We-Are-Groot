from rest_framework.serializers import ModelSerializer

from groot.models import Message
from groot.serializers import UserGetSerializer

class MessageSerializer(ModelSerializer):
    
    sender = UserGetSerializer()
    
    class Meta:
        model = Message
        fields = [
            'id',
            'sender',
            'content',
            'time_sent'
        ]
        read_only_fields = [
            'id',
            'sender',
            'content',
            'time_sent'
        ]

class MessageGetSerializer:
    """
    Serializer for Message model to be used in GET METHOD
    """

    def __init__(self, object, many=False, context=None):
        if many:
            self.data = []
            for message in object:
                self.data.append({
                    'message': MessageSerializer(message).data,
                    'type': 'chat'
                })
        else:
            self.data = {
                'message': MessageSerializer(object).data,
                'type': 'chat'
            }


class MessagePostSerializer(ModelSerializer):
    """
    Serializer for Message model to be used in POST METHOD
    """
    class Meta:
        model = Message
        fields = [
            'id',
            'meeting',
            'sender',
            'content',
            'time_sent',
        ]
        read_only_fields = [
            'id',
            'sender',
            'time_sent',
        ]
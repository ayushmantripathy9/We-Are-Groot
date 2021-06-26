from rest_framework.serializers import ModelSerializer
from groot.serializers import UserGetSerializer

from groot.models import Room


class RoomGetSerializer(ModelSerializer):
    """
        This is to serialize the data pertaining to a Room, where calls would be held.
        This would be used during GET Method.
    """

    participants = UserGetSerializer(read_only=True, many=True)

    class Meta:
        model = Room
        depth = 1

        fields = [
            'id',
            'room_name',
            'room_code',
            'participants',
            'start_time',
            'end_time'
        ]

        read_only_fields = [
            'id',
            'room_name',
            'room_code',
            'participants',
            'start_time',
            'end_time'            
        ]

class RoomPostSerializer(ModelSerializer):
    """
        This is to serialize the data pertaining to a Room, where calls would be held.
        This would be used during POST Method.
    """
    participants = UserGetSerializer(read_only=True, many=True)

    class Meta:
        model = Room

        fields = [
            'id',
            'room_name',
            'room_code',
            'participants',
            'start_time',
            'end_time'            
        ]

        read_only_fields = [
            'id',
            'room_code',
            'start_time'
        ]
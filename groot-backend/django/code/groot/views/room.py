from os import stat
import random
import string

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from groot.models import Room, User
from groot.serializers import UserGetSerializer, RoomGetSerializer, RoomPostSerializer, RoomHistorySerializer

from rest_framework.permissions import IsAuthenticated
from groot.permissions import CanAccessRoom


class RoomViewSet(viewsets.ModelViewSet):
    """
        This is the view that handles all the api requests pertaining to room creation and joining to the Groot App
        The history of rooms of user is also handled by this view

        Methods:
            - perform_create( serializer : RoomPostSerializer  )
                Invoked during creation of a new room
                Generates a room_code and sends it to the frontend
                Handles user addition to the participants_history of the room 

            - join( dict: request )
                Handles user joining the room
                Checks for a room using the request's room_code and adds the user to that room
                Sends the room_data to the user after validating the room_code
                Handles user addition to the participants_history of the room 

            - history( dict : request )
                Used for sending the user data pertaining to a past room that the user was present in 
                Generates a list of rooms of the user using the RoomHistorySerializer      

    """

    def get_serializer_class(self):
        if self.action == "create" or self.action == "update":
            return RoomPostSerializer
        else:
            return RoomGetSerializer

    def get_queryset(self):
        return self.request.user.rooms_of_user.all()
    
    permission_classes = [IsAuthenticated, CanAccessRoom]

    def perform_create(self, serializer):
        room_code = ''.join(
            random.choice(string.ascii_lowercase)
            for _ in range(9)
        )

        while True:
            """
                This is to ensure that same room_code of a pre-existing room,
                is not assigned to that of a new room.
                Thus, every room_code generated is checked until unique
            """
            try:
                existing = Room.objects.get(room_code=room_code)
                room_code = ''.join(
                    random.choice(string.ascii_lowercase)
                    for _ in range(9)
                )

            except Room.DoesNotExist:
                break
        
        serializer.save(
            room_code=room_code,
            participants=[self.request.user.pk,],
            participants_history=[self.request.user.pk]
        )


    @action(detail=False, methods=['post',])
    def join(self, request):
        
        room_code = request.data.get('room_code', None)

        if not room_code:
            return Response(
                {
                    'message': "Room code not provided in the request.",
                    'error': 1, 
                },
            )
        
        user = request.user

        try:
            room = Room.objects.get(room_code=room_code)

            if user in room.participants.all():           
                room_details = RoomGetSerializer(room).data

                return Response(
                    {
                        'message': "User already present in the room.",
                        'room_info': room_details,
                        'error': 0
                    },
                    status=status.HTTP_200_OK
                )
            else:
                room.participants.add(user)
                room.participants_history.add(user)
                room.save()

                room_details = RoomGetSerializer(room).data

                return Response(
                    {
                        'message': "User successfully added to the room.",
                        'room_info': room_details,
                        'error': 0
                    },
                    status=status.HTTP_200_OK
                )                

        except Room.DoesNotExist:
            return Response(
                {
                    'message': "Room doesn't exist.",
                    'error': 2,
                },
            )        

    # in joining response, 
    # error:    0 => no error,  user is already present in the room
    #           1 => room_code not present in request
    #           2 => room with such a room_code is not present


    @action(detail=False, methods=['get',])
    def history(self, request):
        rooms = Room.objects.filter(participants_history__in=[request.user],)
        print("Rooms :" ,rooms)
        rooms_of_user = RoomHistorySerializer(rooms, many=True).data

        return Response(
            {
                'message': "Rooms of User found",
                'rooms': rooms_of_user,
                'error': 0
            }
        )



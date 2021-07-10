from django.db import models
from django.conf import settings

class Room(models.Model):
    """
        This is the Room Model.
        This would contain the rooms created by users for interaction
    """

    # stores the name of the rooom
    room_name = models.CharField(
        max_length=255,
        null=False,
        blank=False
    )
    
    # stores the unique room_code
    room_code = models.CharField(
        max_length=9,
        null=False,
        blank=False
    )

    # the participants who are a part of the room
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='rooms_of_user',
        blank=True
    )

    # the participants history
    participants_history = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='past_rooms_of_user',
        blank=True
    ) 

    # creation time of the room
    start_time = models.DateTimeField(
        auto_now_add=True
    ) 

    end_time = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self) :
        return f"{self.room_name}, code : {self.room_code}"

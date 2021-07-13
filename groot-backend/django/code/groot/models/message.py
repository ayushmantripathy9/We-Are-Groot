from django.db import models
from django.conf import settings

from groot.models import Room

class Message(models.Model):
    """
        The Message Model.
        This represents a message that was sent in a room.

        Attributes:
            - room : ForeignKey 
                - The room in which the message was sent

            - sender : ForeignKey
                - User who sent the message

            - content: CharField
                - The message content

            - time_sent: DateTimeField
                - The sending time of the message

    """

    room = models.ForeignKey(
        Room,
        null=False,
        on_delete=models.CASCADE,
        related_name='message'
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=False,
        on_delete=models.CASCADE
    )

    content = models.CharField(
        max_length=3000,
        null=False,
        blank=False
    )

    time_sent = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Message by : {str(self.sender)} at {str(self.time_sent)}"
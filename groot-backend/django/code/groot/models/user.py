from django.db import models
from django.contrib.auth.models import AbstractUser

# for default profile pic
from django.conf import settings

class User(AbstractUser):
    """
        The User Model.
        This contains all the Users of the app

        Attributes:
            - username : CharField 
                - Username of the user (in case of google auth, this would contain the email)

            - name : CharField
                - The room code

            - profile_pic: TextField
                - URL of the profile pic of the user
                - If not present, it takes the default profile pic URL          

    """

    username = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default=None,
        unique=True
    )

    name = models.CharField(
        max_length=255,
        blank=False,
        null=False
    )

    profile_pic = models.TextField(
        blank=False,
        null=False,
        default=settings.CONFIG_VARS['DEFAULT_PROFILE_PIC']
    )

    def __str__(self):
        return f"{self.name}, username: {self.username}"
    
from django.db import models
from django.contrib.auth.models import AbstractUser

# for default profile pic
from django.conf import settings

class User(AbstractUser):

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
        return f"User-> name = {self.name}, username = {self.username}"
    
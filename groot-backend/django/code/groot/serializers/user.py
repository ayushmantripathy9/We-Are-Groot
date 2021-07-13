from django.db.models import fields
from rest_framework.serializers import ModelSerializer
from groot.models import User

class UserGetSerializer(ModelSerializer):
    """
        The User Serializer to be used for GET requests
    """
    class Meta:

        model = User

        fields = [
            'id',
            'name',
            'profile_pic',
            'username',
            'email'
        ]

        read_only_fields = [
            'id',
            'name',
            'profile_pic',
            'username',
            'email'            
        ]

class UserPostSerializer(ModelSerializer):
    """
        The User Serializer to be used for POST requests
    """
    class Meta:

        model = User

        fields = [
            'id',
            'name',
            'username',
            'profile_pic',
            'email'
        ]

        read_only_fields = [
            'id',
        ]
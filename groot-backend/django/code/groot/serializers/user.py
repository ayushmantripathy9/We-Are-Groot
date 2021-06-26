from django.db.models import fields
from rest_framework.serializers import ModelSerializer
from groot.models import User

# the UserGetSerializer to be used for GET requests
class UserGetSerializer(ModelSerializer):
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


# the UserPostSerializer to be used for POST requests 
class UserPostSerializer(ModelSerializer):
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
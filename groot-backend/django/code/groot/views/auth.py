import json
from os import stat
from django.http import response
import requests
import base64

from django.contrib.auth import login, logout

from rest_framework import serializers, viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response


from grootBackend.settings import CONFIG_VARS
from groot.models import User
from groot.serializers import UserGetSerializer, UserPostSerializer


class AuthViewSet(viewsets.ModelViewSet):
    """
        This is the view that handles all the api requests pertaining to user authentication to the Groot App

        Methods:
            - verify( dict : request )
                Checks user is logged in to the app or not

            - googleLogin( dict: request )
                Handles user login using Google OAuth

            - githubLogin( dict : request )
                Handles user login using Google OAuth        

            - logout()
                Logs out the user from the app
    """
    
    queryset = User.objects.all()
    permission_classes = (AllowAny,)

    def get_serializer_class(self):

        if self.action == "create" or self.action == "update" or self.action == "partial":
            return UserPostSerializer
        else:
            return UserGetSerializer

    # Verify whether user is logged in or not
    @action(detail=False, methods=['get', ])
    def verify(self, request):
        """
            Check whether the user is authenticated or not
            If user is authenticated, then send user-details to the frontend
        """
        if request.user.is_authenticated:
            user = User.objects.get(username=request.user.username)
            user_serializer = self.get_serializer_class()(user)
            
            user_details = user_serializer.data

            return Response(
                {
                    'isLoggedIn': True,
                    'user_details': user_details
                },
                status=status.HTTP_200_OK
            )
        
        else:
            return Response (
                {
                    'isLoggedIn': False
                }, 
                status=status.HTTP_200_OK
            )


    # Login User via Google
    @action(detail=False, methods=['post', ],)
    def googleLogin(self, request):

        if request.user.is_authenticated:
            return Response(
                {
                    'message': 'The user is already logged in to the app.', 
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            """
                Obtain the auth_code from the request data
                Then make a request to the token-endpoint, to receive the user data
            """
            data = request.data
            auth_code = data['auth_code']

            token_endpoint = "https://oauth2.googleapis.com/token"

            request_data = {
                'code': auth_code,
                'client_id': CONFIG_VARS['GOOGLE']['CLIENT_ID'],
                'client_secret': CONFIG_VARS['GOOGLE']['CLIENT_SECRET'],
                'redirect_uri': CONFIG_VARS['FRONTEND']['REDIRECT_URI'],
                'grant_type': 'authorization_code'
            }

            token_response = requests.post(
                url=token_endpoint,
                data=request_data
            ).json()

            if token_response == None:
                return Response(
                    {
                        'message': 'Invalid authorization code provided.'
                    }, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            """
                If a token_response was successfully received from Google,
                Parse the token_response to derive user_details from it
            """
            id_token_jwt = token_response['id_token']
            content = id_token_jwt.split('.')[1]
            padding = len(str(content)) % 4
            content = content + padding*"="

            content_bytes = base64.b64decode(content)
            content_ascii = content_bytes.decode('ascii')
            user_data = json.loads(content_ascii)

            try:
                """
                    Login the user into the backend if it already exists
                    Then send user-details to the frontend
                """
                user = User.objects.get(email=user_data['email'])
                login(request, user)

                user_serializer = UserGetSerializer(user)
                user_details = user_serializer.data
                
                return Response(
                    {
                        'message': "User logged in successfully via GitHub",
                        'user_details': user_details
                    },
                    status=status.HTTP_200_OK
                )


            except User.DoesNotExist:
                """
                    Create a new user in the backend and store its details
                    Then login the user to the backend
                    Finally send the user-details to the frontend
                """
                email = user_data['email']
                name = user_data['name']
                username = user_data['given_name']
                profile_pic = user_data['picture']

                user_new = User(
                    email=email,
                    name=name,
                    username=email,
                    profile_pic=profile_pic
                )

                user_new.save()
                login(request, user_new)

                user_new_serializer = UserGetSerializer(user_new)
                user_details = user_new_serializer.data

                return Response(
                    {
                        'message': "User logged in successfully via Google",
                        'user_details': user_details
                    },
                    status=status.HTTP_200_OK
                )

    # Login User via GitHub
    @action(detail=False, methods=['post', ],)
    def githubLogin(self,request):
        if request.user.is_authenticated:
            return Response(
                {
                    'message': 'The user is already logged in to the app.', 
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            """
                Obtain the auth_code from the request data
                Then make a request to the token-endpoint, to receive the access_token 
                (access_token -> would be required to access the data)
            """                    
            data = request.data
            auth_code = data['auth_code']   

            token_endpoint = "https://github.com/login/oauth/access_token"

            request_data = {
                'code': auth_code,
                'client_id': CONFIG_VARS['GITHUB']['CLIENT_ID'],
                'client_secret': CONFIG_VARS['GITHUB']['CLIENT_SECRET'],
                'redirect_uri': CONFIG_VARS['FRONTEND']['REDIRECT_URI']
            }

            auth_token_response = requests.post(
                url=token_endpoint,
                data=request_data
            )

            

            if auth_token_response == None:
                return Response (
                    {
                        'message': "Invalid authorization code provided"
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            else:
                """
                    Obtain the access_token from the auth_token_response
                    Then make a request with the access_token to get the user-details
                """
                token_res_data = auth_token_response.text.split('&')[0] # access_token=<access_token>
                access_token = token_res_data.split('=')[1] 
                access_token = 'token '+access_token    # format = token <access_token>

                user_data_endpoint = "https://api.github.com/user"

                user_data = requests.get(
                    url=user_data_endpoint,
                    headers= {
                        'Authorization': access_token,
                    }
                ).json()

                try:
                    """
                        Login the user into the backend if it already exists
                        Then send user-details to the frontend
                    """                
                    user = User.objects.get(username=user_data['login'])
                    login(request, user)

                    user_serializer = UserGetSerializer(user)
                    user_details = user_serializer.data

                    return Response (
                        {
                            'message': "User logged in successfully via GitHub",
                            'user_details': user_details
                        },
                        status=status.HTTP_200_OK
                    )
                
                except User.DoesNotExist:
                    """
                        Create a new user in the backend and store its details
                        Then login the user to the backend
                        Finally send the user-details to the frontend
                    """
                    name = user_data['name']
                    username = user_data['login']
                    profile_pic = user_data['avatar_url']

                    user_new = User(
                        username=username,
                        name=name,
                        profile_pic=profile_pic
                    )

                    user_new.save()
                    login(request, user_new)

                    user_new_serializer = UserGetSerializer(user_new)
                    user_details = user_new_serializer.data

                    return Response (
                        {
                            'message': "User logged in successfully via GitHub",
                            'user_details': user_details
                        },
                        status=status.HTTP_200_OK
                    )

    # Logout User
    @action(detail=False, methods=['post',])
    def logout(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response (
                {
                    'message': "User logged out successfully."
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response (
                {
                    'message': "User isn't logged in"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
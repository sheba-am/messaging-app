from django.contrib.auth.models import User
from rest_framework import serializers
from .models import User
from chat.models import Room
from django.db import models
# from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'friendRequests', 'friends', 'blocked', 'chats']

    def get_name(self, obj):
        name = obj.first_name
        if name =='':
            name = obj.email
        return name

    def get_isAdmin(self, obj):
        return obj.is_staff
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'token']
    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class GroupSerializer(serializers.ModelSerializer):
    names = models.JSONField(null = True, blank=True)
    class Meta:
        model = Room
        fields = ['name', 'names']
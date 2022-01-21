import os
from requests_cache import CachedSession
import googleapiclient.discovery
from rest_framework import generics, permissions
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import User
# from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
import requests
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
import json
from django.db import IntegrityError
from django.db.models import Q
# Create your views here.

@api_view(['GET'])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    try:
        data = request.data
        user = User.objects.create(
            first_name=data['name'],
            username=data['username'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializer(user,many=False)
        return Response(serializer.data)
    except IntegrityError as e: 
            return Response("username already registered")

@api_view(['GET'])
def searchUsers(request):
    data = request.data
    users = User.objects.filter(Q(username__contains=data['keyword']) | Q(first_name__contains=data['keyword']))
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def friendRequest(request):
    data = request.data
    user = User.objects.get(username=data['to'])
    allrequests = user.friendRequests
    if(allrequests):
        allrequests.append(data['from'])
    else:
        dataFrom = []
        dataFrom.append(data['from'])
        user.friendRequests = dataFrom
    user.save()
    serializer = UserSerializer(user)
    return Response(serializer.data)
 
@api_view(['GET'])
def friendRequestResponse(request):
    data = request.data
    user = User.objects.get(username=data['username'])
    allrequests = user.friendRequests
    print(allrequests)
    allFriends = user.friends
    print(allFriends)
    num = int(data['num'])
    if(data['accept'] == 'yes'):
        if(allFriends):
            allFriends.append(allrequests[num])
        else:
            dataFrom = []
            dataFrom.append(allrequests[num])
            user.friends = dataFrom
        
    print(allrequests[0])           
    allrequests.pop(num)
    user.save()
    print(allrequests)
    serializer = UserSerializer(user) 
    return Response(serializer.data)

@api_view(['GET'])
def blockUser(request):
    data = request.data
    print(data['username'])
    user = User.objects.get(username=data['username'])
    allblocked = user.blocked
    if(allblocked):
        allblocked.append(data['block'])
    else:
        dataFrom = []
        dataFrom.append(data['block'])
        user.blocked = dataFrom
    if data['block'] in user.friends:
        user.friends.remove(data['block'])
    user.save()
    serializer = UserSerializer(user)
    return Response(serializer.data)


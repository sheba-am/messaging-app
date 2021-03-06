import os
from django.shortcuts import render
from requests_cache import CachedSession
from django.http import HttpResponseRedirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
import googleapiclient.discovery
from rest_framework import generics, permissions
from .serializers import UserSerializer, GroupSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import User
from django.contrib.auth import login, logout, authenticate
# from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
import requests
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
import json
from django.db import IntegrityError
from django.db.models import Q
from chat.models import Private, Room
# Create your views here.

@api_view(['GET'])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data)
#by username
@api_view(['POST'])
def getUserById(request):
    data = request.data
    print(data)
    user = User.objects.get(username=data['username'].lower())
    serializer = UserSerializer(user,many=False)
    return Response(serializer.data)
#by id
@api_view(['POST'])
def getUserById(request):
    data = request.data
    print(data)
    user = User.objects.get(id=data['id'].lower())
    serializer = UserSerializer(user,many=False)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    try:
        data = request.data
        user = User.objects.create(
            first_name=data['name'].lower(),
            username=data['username'].lower(),
            email=data['email'].lower(),
            password=make_password(data['password'])
        )
        serializer = UserSerializer(user,many=False)
        return Response(serializer.data)
    except IntegrityError as e: 
            return Response("username already registered")
@api_view(['POST'])
def loginuser(request):
    # if request.method == 'GET':
        # return render(request, '../templates/loginPage.html', {'form':AuthenticationForm()})
    # elif request.method == 'POST':
    user = authenticate(request, username=request.data['username'].lower(), password=request.data['password'])
    print(user)
    if user is None:
            return Response("username and password don't match")
    else:
        # login(request, user)
        # return HttpResponseRedirect('/')
        serializer = UserSerializer(user,many=False)
        return Response(serializer.data)

# @login_required(login_url='login')
def logoutuser(request):
    # if request.method == 'POST':
    logout(request) 
    return HttpResponseRedirect('/login')

@api_view(['POST'])
def searchUsers(request):
    data = request.data
    print(data)
    users = User.objects.filter(Q(username__contains=data['keyword'].lower()) | Q(first_name__contains=data['keyword'].lower()))
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data)

@api_view(['POST'])
def createGroup(request):
    data = request.data
    print("request is:")
    print(data)
    chat_room, created = Room.objects.get_or_create(name=data['name'])
    user = User.objects.filter(username=data['username'])[0]
    user.chats.append(data['name'])
    user.save()
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
def getGroup(request):
    data = request.data
    print(data)
    chat_room = None
    names = []
    chat_room = Room.objects.get(name=data['name'])
    dictData = {'name': chat_room.name}
    for item in chat_room.members.all():
        names.append(item.username)
    dictData['members'] = names
    return Response(dictData)


@api_view(['POST'])
def friendRequest(request):
    data = request.data
    print(data)
    user = User.objects.get(username=data['to'].lower())
    if(user.blocked != None and user.blocked != []):
        if (data['from'] in user.blocked):
            return Response("You are blocked by this user")
    allrequests = user.friendRequests
    if(allrequests):
        allrequests.append(data['from'].lower())
    else:
        dataFrom = []
        dataFrom.append(data['from'].lower())
        user.friendRequests = dataFrom
    user.save()
    serializer = UserSerializer(user)
    return Response(serializer.data)
 
@api_view(['POST'])
def friendRequestResponse(request):
    data = request.data
    print(data)
    user = User.objects.get(username=data['username'].lower())
    allrequests = user.friendRequests
    allFriends = user.friends
    num = int(data['num'])
    other_user = User.objects.get(username=allrequests[num].lower())
    if(data['accept'].lower() == 'yes'):
        
        if(allFriends):
            allFriends.append(allrequests[num])
            if(other_user.friends):
                other_user.friends.append(user.username)
            else:
                other_user.friends = [user.username]
        else:
            dataFrom = []
            dataFrom.append(allrequests[num])
            user.friends = dataFrom
            if(other_user.friends):
                other_user.friends.append(user.username)
            else:
                other_user.friends = [user.username]

        Private.objects.create(
            name= str(user.username) + str(other_user.username),
            user1=user,
            user2=other_user
        )
        
    print(allrequests[0])           
    allrequests.pop(num)
    user.save()
    other_user.save()
    print(allrequests)
    serializer = UserSerializer(user) 
    return Response(serializer.data)

@api_view(['POST'])
def blockUser(request):
    data = request.data
    user = User.objects.get(username=data['username'].lower())
    other_user = User.objects.get(username=data['block'].lower())
    allblocked = user.blocked
    #remove chat
    if(data['block'].lower() in user.friends):
        rooms = Private.objects.filter(user1=user,user2=other_user) | Private.objects.filter(user1=other_user,user2=user)
        rooms[0].delete()
    if(allblocked):
        allblocked.append(data['block'].lower())
    else:
        dataFrom = []
        dataFrom.append(data['block'].lower())
        user.blocked = dataFrom

    if data['block'].lower() in user.friends:
        print("here")
        user.friends.remove(data['block'].lower())
        print(other_user.friends)
        other_user.friends.remove(user.username.lower())
    user.save()
    other_user.save()
    serializer = UserSerializer(user)
    return Response(serializer.data)


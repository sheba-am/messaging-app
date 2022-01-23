from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from chat.models import Room, Private
from django.db.models import Q
from api.models import User
from rest_framework.decorators import api_view, permission_classes

def index_view(request):
    return render(request, 'index.html', {
        'rooms': Room.objects.all(),
    })
@api_view(['GET'])
@login_required(login_url='http://127.0.0.1:8000/api/login')
def room_view(request, room_name):
    print(request.user)
    chat_room, created = Room.objects.get_or_create(name=room_name)
    return render(request, 'room.html', {
        'room': chat_room,
    })

@login_required(login_url='http://127.0.0.1:8000/api/login')
def private_view(request, username):
    me = request.user
    other_user = User.objects.get(username=username)
    rooms = Private.objects.filter(user1=me,user2=other_user) | Private.objects.filter(user1=other_user,user2=me)
    print(rooms)
    if(len(rooms)==0):
        chat_room = Private.objects.create(
            name= str(me) + "_to_" + str(username),
            user1=me,
            user2=other_user
        )
        return render(request, 'private.html', {
        'room': chat_room,
        })
    else:
        return render(request, 'private.html', {
        'room': rooms[0],
        })
    # print("filter")
    # for item in rooms:
        # print(item.name)
    # chat_room, created = Private.objects.get_or_create(Q(user1==me,user2.username==username) | Q(user1.username==username,user2.username==me))
    # for item in chat_room:
    #     print(item.name)
    # return render(request, 'private.html')
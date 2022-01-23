import json
from django.http import HttpResponseRedirect
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from api.models import User
from django.shortcuts import get_object_or_404
from .models import Room, Message, Private, PrivateMessage

class ChatConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None
        self.user_inbox = None

    def connect(self):

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.room = Room.objects.get(name=self.room_name)
        self.user = self.scope['user']
        self.user_inbox = f'inbox_{self.user.username}'
        # connection has to be accepted
        self.accept()
        #add group to user's groups
        userdata = User.objects.filter(username=self.user.username)
        if(len(userdata)==1):
            #if this is the first time joinging the group, add group
            if(userdata[0].groups):
                if((self.room_name not in userdata[0].groups)):
                    userdata[0].groups.append(self.room_name)
            else:
                first = []
                first.append(self.room_name)
                userdata[0].groups = first
            userdata[0].save()
        
        # join the room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        
        # send the user list to the newly joined user
        self.send(json.dumps({
            'type': 'user_list',
            'users': [user.username for user in self.room.online.all()],
        }))

        if self.user.is_authenticated:
            # create a user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )
            contents = []
            users = []
            timestamps = []
            for item in Message.objects.all():
                if(item.room.name == self.room_name):
                    contents.append(item.content)
                    users.append(item.user.username)
                    timestamps.append(str(item.timestamp))
            # send the join event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                    'contents': contents,
                    'users': users,
                    'timestamps': timestamps,
                }
            )
            self.room.online.add(self.user)


    def disconnect(self, close_code):
        # pass
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

        if self.user.is_authenticated:
            # delete the user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )

            # send the leave event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user': self.user.username,
                }
            )
            # self.room.online.remove(self.user)

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if not self.user.is_authenticated:
            return
        if message.startswith('/pm '):
            split = message.split(' ', 2)
            target = split[1]
            target_msg = split[2]

            # send private message to the target
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target}',
                {
                    'type': 'private_message',
                    'user': self.user.username,
                    'message': target_msg,
                }
            )
            # send private message delivered to the user
            self.send(json.dumps({
                'type': 'private_message_delivered',
                'target': target,
                'message': target_msg,
            }))
            return

        # send chat message event to the room
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'user': self.user.username,
                'message': message,
            }
        )
        Message.objects.create(user=self.user, room=self.room, content=message)

    def chat_message(self, event):
        self.send(text_data=json.dumps(event))

    def user_join(self, event):
        self.send(text_data=json.dumps(event))

    def user_leave(self, event):
        self.send(text_data=json.dumps(event))

    def private_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message_delivered(self, event):
        self.send(text_data=json.dumps(event))


class PrivateConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None
        self.user_inbox = None

    def connect(self):
        self.user = self.scope['user']
        other = self.scope['url_route']['kwargs']['username']
        self.room_name = other
        print("room_name")
        print(self.room_name)
        self.room_group_name = f'chat_{self.room_name}'
        self.room = Private.objects.get(name=self.room_name)

        # connection has to be accepted
        self.accept()
        #add group to user's groups
        userdata = User.objects.filter(username=self.user.username)
        if(len(userdata)==1):
            #if this is the first time joinging the group, add group
            if(userdata[0].groups):
                if((self.room_name not in userdata[0].groups)):
                    userdata[0].groups.append(self.room_name)
            else:
                first = []
                first.append(self.room_name)
                userdata[0].groups = first
            userdata[0].save()
        
        # join the room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        

        if self.user.is_authenticated:
            contents = []
            users = []
            timestamps = []
            for item in PrivateMessage.objects.all():
                if(item.room.name == self.room_name):
                    contents.append(item.content)
                    users.append(item.user.username)
                    timestamps.append(str(item.timestamp))
            # send the join event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                    'contents': contents,
                    'users': users,
                    'timestamps': timestamps,
                }
            )
            # self.room.online.add(self.user)

    def disconnect(self, close_code):
        # pass
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

        if self.user.is_authenticated:
            # delete the user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )

            # send the leave event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user': self.user.username,
                }
            )
            # self.room.online.remove(self.user)

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if not self.user.is_authenticated:
            return
        if message.startswith('/pm '):
            split = message.split(' ', 2)
            target = split[1]
            target_msg = split[2]

            # send private message to the target
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target}',
                {
                    'type': 'private_message',
                    'user': self.user.username,
                    'message': target_msg,
                }
            )
            # send private message delivered to the user
            self.send(json.dumps({
                'type': 'private_message_delivered',
                'target': target,
                'message': target_msg,
            }))
            return

        # send chat message event to the room
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'user': self.user.username,
                'message': message,
            }
        )
        PrivateMessage.objects.create(user=self.user, room=self.room, content=message)

    def chat_message(self, event):
        self.send(text_data=json.dumps(event))

    def user_join(self, event):
        self.send(text_data=json.dumps(event))

    def user_leave(self, event):
        self.send(text_data=json.dumps(event))

    def private_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message_delivered(self, event):
        self.send(text_data=json.dumps(event))




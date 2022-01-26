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
        data = self.scope['url_route']['kwargs']['room_name']
        names = data.split("-")
        self.room_name = names[1]
        self.room_group_name = f'chat_{self.room_name}'
        self.room = Room.objects.get_or_create(name=self.room_name)[0]
        self.user = User.objects.filter(username=names[0])[0]
        # print("here")
        self.user_inbox = f'inbox_{self.user.username}'
        # print("user_inbox")
        # print(self.user_inbox)
        # connection has to be accepted
        self.accept()
        #add group to user's groups
        userdata = User.objects.filter(username=self.user.username)
        if(len(userdata)==1):
            #if this is the first time joinging the group, add group
            if(userdata[0].chats):
                if((self.room_name not in userdata[0].chats)):
                    userdata[0].chats.append(self.room_name)
            else:
                first = []
                first.append(self.room_name)
                userdata[0].chats = first
            userdata[0].save()
        
        # join the room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        
        # send the user list to the newly joined user
        self.send(json.dumps({
            'type': 'user_list',
            'users': [user.username for user in self.room.members.all()],
        }))
        #remove authentication
        if True:
            # create a user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )
            contents = []
            users = []
            timestamps = []
            count = 0
            for item in Message.objects.all():
                if count == 100:
                    break
                if(item.room.name == self.room_name):
                    contents.append(item.content)
                    users.append(item.user.username)
                    timestamps.append(str(item.timestamp))
                count += 1
            # send the join event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                }
            )
            if(self.user not in self.room.members.all()):
                self.room.members.add(self.user)
            #send the messages in chat to new user
            target = self.user.username
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target}',
                {
                    'type': 'prev_messages',
                    'user': self.user.username,
                    'contents': contents,
                    'users': users,
                    'timestamps': timestamps,
                }
            )
            return


    def disconnect(self, close_code):
        # pass
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )
        #remove authentication
        if True:
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
        # print(text_data_json)
        message = text_data_json['message'] 
        # if not self.user.is_authenticated:
        #     return
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
        user = User.objects.filter(username=self.user.username)
        if(len(user)==0):
            pass
            # Message.objects.create(user=None, room=self.room, content=message)
        else:
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

    def prev_messages(self, event):
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
        
        scopeName = self.scope['url_route']['kwargs']['room_name']
        # print("scope")
        # print(self.scope['headers'])
        # print(self.room_name)
        names = scopeName.split("-")
        self.user = User.objects.filter(username=names[0])[0]
        # print(User.objects.filter(username=names[0]))
        user1 = self.user
        print("username" + names[1])
        print("len" + str(User.objects.filter(username=names[1])))
        user2 = User.objects.filter(username=names[1])[0]
        # print("room_name")
        # print(self.room_name)
        self.room_group_name = f'chat_{self.room_name}'
        getRoom = Private.objects.filter(user1=user1,user2=user2) | Private.objects.filter(user1=user2,user2=user1)
        if(not getRoom):
            return
        self.room = getRoom[0]
        self.room_name = self.room.name
        self.user_inbox = f'inbox_{self.user.username}'
        # connection has to be accepted
        self.accept()
        #add group to user's groups
        userdata = User.objects.filter(username=self.user.username)
        if(len(userdata)==1):
            #if this is the first time joinging the group, add group
            if(userdata[0].chats):
                if((self.room_name not in userdata[0].chats)):
                    userdata[0].chats.append(self.room_name)
            else:
                first = []
                first.append(self.room_name)
                userdata[0].chats = first
            userdata[0].save()
        
        # join the room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        
        #remove authentication
        if True:
            # create a user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )
            contents = []
            users = []
            timestamps = []
            count = 0
            for item in PrivateMessage.objects.all():
                if count == 100:
                    break
                # print("room_name: " + self.room_name)
                # print("item_room: " + item.room.name)
                if(item.room.name == self.room_name):
                    contents.append(item.content)
                    users.append(item.user.username)
                    timestamps.append(str(item.timestamp))
                count += 1
            # print(contents)
            # send the join event to the room
            # print(contents)
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                }
            )
            # self.room.online.add(self.user)
            # print(self.user.username)
            target = self.user.username
            # print("target")
            # print(target)
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target}',
                {
                    'type': 'prev_messages',
                    'user': self.user.username,
                    'contents': contents,
                    'users': users,
                    'timestamps': timestamps,
                }
            )
            

    # def disconnect(self, close_code):
    #     # pass
    #     async_to_sync(self.channel_layer.group_discard)(
    #         self.room_group_name,
    #         self.channel_name,
    #     )

    #     if self.user.is_authenticated:
    #         # delete the user inbox for private messages
    #         async_to_sync(self.channel_layer.group_add)(
    #             self.user_inbox,
    #             self.channel_name,
    #         )

    #         # send the leave event to the room
    #         async_to_sync(self.channel_layer.group_send)(
    #             self.room_group_name,
    #             {
    #                 'type': 'user_leave',
    #                 'user': self.user.username,
    #             }
    #         )
    #         # self.room.online.remove(self.user)

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        # if not self.user.is_authenticated:
        #     return
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
        # print("message is: " + message)
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

    def prev_messages(self, event):
        self.send(text_data=json.dumps(event))





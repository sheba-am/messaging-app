from api.models import User
from django.db import models


class Room(models.Model):
    name = models.CharField(max_length=128)
    members = models.ManyToManyField(to=User, blank=True)

    def get_memeber_count(self):
        return self.members.count()

    def join(self, user):
        self.members.add(user)
        self.save()

    def leave(self, user):
        self.members.remove(user)
        self.save()

    def __str__(self):
        return f'{self.name} ({self.get_memeber_count()})'

class Private(models.Model):
    name = models.CharField(max_length=128)
    user1 = models.ForeignKey(User, blank=True, on_delete=models.DO_NOTHING, related_name='user1')
    user2 = models.ForeignKey(User, blank=True, on_delete=models.DO_NOTHING, related_name='user2')
    
    def __str__(self):
        return self.name

class Message(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    room = models.ForeignKey(to=Room, on_delete=models.CASCADE)
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username}: {self.content} [{self.timestamp}]'

class PrivateMessage(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    room = models.ForeignKey(to=Private, on_delete=models.CASCADE)
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username}: {self.content} [{self.timestamp}]'

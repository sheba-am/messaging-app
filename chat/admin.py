from django.contrib import admin

# Register your models here.
from chat.models import Room, Message, Private, PrivateMessage

admin.site.register(Room)
admin.site.register(Message)
admin.site.register(Private)
admin.site.register(PrivateMessage)
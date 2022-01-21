from django.db import models
from django.contrib.auth.models import AbstractUser
from jsonfield import JSONField
# Create your models here.

class User(AbstractUser):
    friends = models.JSONField(null = True, blank=True)
    friendRequests = models.JSONField(null = True, blank=True)
    blocked = models.JSONField(null = True, blank=True)
    groups = models.JSONField(null = True, blank=True)
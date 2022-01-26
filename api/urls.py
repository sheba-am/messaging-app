from django.urls import path
from . import views
urlpatterns = [
    path('users',  views.getUsers),
    path('getUser',  views.getUserById),
    path('users/register',  views.registerUser),
    path('users/search',  views.searchUsers),
    path('users/friendRequest',  views.friendRequest),
    path('users/friendRequestResponse',  views.friendRequestResponse),
    path('users/block',  views.blockUser),
    path('users/newGroup',  views.createGroup),
    path('users/getGroup',  views.getGroup),

    #Auth
    path('logout', views.logoutuser, name='logout'),
    path('login', views.loginuser, name='login'),
]

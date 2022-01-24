from django.urls import path

from . import views

urlpatterns = [
    path('', views.index_view, name='chat-index'),
    path('group/<str:room_name>/', views.room_view, name='chat-room'),
    path('private/<str:room_name>/', views.private_view, name='private-room'),
]

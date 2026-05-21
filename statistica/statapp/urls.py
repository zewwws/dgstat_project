from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_file, name='upload_file'),
    path('get_latest_file/', views.get_latest_file, name='get_latest_file'),
    path('save_trimester_snapshot/', views.save_trimester_snapshot, name='save_trimester_snapshot'),
]

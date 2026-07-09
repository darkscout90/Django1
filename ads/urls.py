from django.urls import path
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns   # импорт
urlpatterns = [
    path('', views.index, name='index'),  # Главная страница
]
urlpatterns += staticfiles_urlpatterns()
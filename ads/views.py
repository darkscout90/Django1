
# Create your views here.
from django.shortcuts import render
from .models import Ad  # Импортируем нашу модель


def index(request):
    """Главная страница - показывает все объявления"""
    # Получаем ВСЕ объявления из базы данных
    # order_by('-created_at') - сортируем по дате, новые сверху
    ads = Ad.objects.all().order_by('-created_at')

    # Передаем объявления в шаблон
    context = {
        'ads': ads,
        'title': 'Доска объявлений'
    }

    # Рендерим шаблон index.html с данными
    return render(request, 'ads/index.html', context)
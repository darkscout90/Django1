
# Register your models here.
from django.contrib import admin
from .models import Ad  # Импортируем нашу модель


# Регистрируем модель Ad в админке
@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    # Поля, которые отображаются в списке объявлений
    list_display = ('title', 'price', 'created_at', 'phone')

    # Поля, по которым можно искать
    search_fields = ('title', 'description', 'phone')

    # Фильтры справа
    list_filter = ('created_at', 'price')

    # Поля для редактирования прямо в списке
    list_editable = ('price',)
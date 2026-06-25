from django.db import models

# Create your models here.
from django.db import models


# Создаем класс Объявление - это таблица в базе данных
class Ad(models.Model):
    # Поле "заголовок" - короткий текст, максимум 200 символов
    title = models.CharField(max_length=200, verbose_name="Заголовок")

    # Поле "описание" - длинный текст, может быть пустым
    description = models.TextField(verbose_name="Описание", blank=True)

    # Поле "цена" - целое число, может быть пустым
    price = models.IntegerField(verbose_name="Цена", blank=True, null=True)

    # Поле "дата создания" - автоматически ставится при создании
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    # Поле "контактный телефон"
    phone = models.CharField(max_length=20, verbose_name="Телефон")

    # Метод для красивого отображения в админке
    def __str__(self):
        return self.title

    # Класс для отображения в админке
    class Meta:
        verbose_name = "Объявление"
        verbose_name_plural = "Объявления"
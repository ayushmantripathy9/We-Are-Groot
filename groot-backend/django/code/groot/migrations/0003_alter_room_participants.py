# Generated by Django 3.2.4 on 2021-06-25 03:31

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groot', '0002_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='participants',
            field=models.ManyToManyField(blank=True, related_name='rooms_of_user', to=settings.AUTH_USER_MODEL),
        ),
    ]

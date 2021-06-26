# Generated by Django 3.2.4 on 2021-06-24 14:47

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groot', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_name', models.CharField(max_length=255)),
                ('room_code', models.CharField(max_length=9)),
                ('start_time', models.DateTimeField(auto_now_add=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('participants', models.ManyToManyField(blank=True, related_name='rooms_of_participant', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
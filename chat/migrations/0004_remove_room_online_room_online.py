# Generated by Django 4.0.1 on 2022-01-24 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_privatemessage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='online',
        ),
        migrations.AddField(
            model_name='room',
            name='online',
            field=models.JSONField(blank=True, null=True),
        ),
    ]

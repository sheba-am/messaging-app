# Generated by Django 4.0.1 on 2022-01-24 07:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_user_chats_remove_user_groups_user_groups'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Group',
        ),
    ]
# Generated by Django 4.0.1 on 2022-01-21 10:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_blocked_user_frienrrequests_remove_user_groups_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='frienRrequests',
            new_name='frienRequests',
        ),
    ]
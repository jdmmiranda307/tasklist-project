# Generated by Django 2.1.7 on 2019-03-08 02:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0002_auto_20190306_1658'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='task.Status'),
        ),
    ]

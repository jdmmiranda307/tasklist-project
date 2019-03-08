from .models import Task
from rest_framework import serializers

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'user', 'title', 'status', 'description', 'created_at', 'updated_at', 'completed_at', 'excluded_at')

from django.db import models
from django.contrib.auth.models import User

class Status(models.Model):
	description = models.CharField(max_length=255)

	def __str__(self):
		return self.description

class Task(models.Model):
    user = models.ForeignKey(User, related_name="tasks", on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=255)
    status = models.ForeignKey(Status, related_name="tasks", on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    excluded_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.title

from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.utils import timezone

class TaskViewSet(viewsets.ModelViewSet):
	serializer_class = TaskSerializer

	def get_queryset(self):
		user = self.request.user
		queryset = Task.objects.all().filter(excluded_at=None, user=user).order_by('-created_at')
		return queryset

	def create(self, request):
		user_id = request.user.id
		serializer = TaskSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save(user=self.request.user, status_id=1)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	@action(detail=True, methods=['put'])
	def update_status(self, request, pk):
		status_id = request.data["status"]
		#Chose to use filter and then .first() to avoid to get an nonexistent Task and throw error
		task = Task.objects.filter(pk=pk).first() 
		if task:
			task.status_id = status_id
			task.save()
			return Response(status=status.HTTP_200_OK)
		return Response(status=status.HTTP_400_BAD_REQUEST)

	def destroy(self, request, pk=None):
		#Chose to use filter and then .first() to avoid to get an nonexistent Task and throw error
		task = Task.objects.filter(pk=pk).first()
		if task:
			task.excluded_at = timezone.now()
			task.save()
			return Response(status=status.HTTP_200_OK)
		return Response(status=status.HTTP_400_BAD_REQUEST)

import csv
import io
from datetime import datetime

from django.db.models import Count
from django.http import HttpResponse
from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task
from .serializers import TaskSerializer


class TaskPagination(PageNumberPagination):
    page_size_query_param = "limit"
    page_query_param = "page"


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = TaskPagination

    def get_queryset(self):
        queryset = Task.objects.filter(owner=self.request.user)
        search = self.request.query_params.get("search")
        status = self.request.query_params.get("status")
        if search:
            queryset = queryset.filter(title__icontains=search)
        if status and status != "all":
            queryset = queryset.filter(status=status)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)


class TaskBulkCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        tasks_data = []

        if "file" in request.FILES:
            # CSV upload path
            csv_file = request.FILES["file"]
            text = io.StringIO(csv_file.read().decode("utf-8"))
            reader = csv.DictReader(text)
            for row in reader:
                tasks_data.append(
                    {
                        "title": row.get("title") or "",
                        "description": row.get("description") or "",
                        "status": row.get("status") or Task.STATUS_PENDING,
                    }
                )
        else:
            # JSON array path
            tasks_data = request.data.get("tasks", [])

        created = []
        for item in tasks_data:
            serializer = TaskSerializer(data=item)
            if serializer.is_valid():
                serializer.save(owner=request.user)
                created.append(serializer.data)

        return Response({"created": created})


class TaskStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Task.objects.filter(owner=request.user)
        total = qs.count()
        completed = qs.filter(status=Task.STATUS_COMPLETED).count()
        pending = qs.filter(status=Task.STATUS_PENDING).count()
        in_progress = qs.filter(status=Task.STATUS_IN_PROGRESS).count()
        return Response(
            {
                "total": total,
                "completed": completed,
                "pending": pending,
                "in_progress": in_progress,
            }
        )


class TaskExportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from_str = request.query_params.get("from")
        to_str = request.query_params.get("to")
        status = request.query_params.get("status")

        qs = Task.objects.filter(owner=request.user)
        if from_str:
            qs = qs.filter(created_at__date__gte=from_str)
        if to_str:
            qs = qs.filter(created_at__date__lte=to_str)
        if status and status != "all":
            qs = qs.filter(status=status)

        # For simplicity return CSV with .xls mime so it opens in Excel
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Title", "Description", "Status", "Created At"])
        for task in qs:
            writer.writerow(
                [task.title, task.description, task.status, task.created_at.strftime("%Y-%m-%d %H:%M:%S")]
            )

        response = HttpResponse(output.getvalue(), content_type="application/vnd.ms-excel")
        response["Content-Disposition"] = 'attachment; filename="tasks_export.csv"'
        return response


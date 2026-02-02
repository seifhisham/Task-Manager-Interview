from django.urls import path

from .views import TaskBulkCreateView, TaskExportView, TaskListCreateView, TaskRetrieveUpdateDestroyView, TaskStatsView

urlpatterns = [
    path("", TaskListCreateView.as_view(), name="task-list-create"),
    path("<int:pk>/", TaskRetrieveUpdateDestroyView.as_view(), name="task-detail"),
    path("bulk", TaskBulkCreateView.as_view(), name="task-bulk"),
    path("stats", TaskStatsView.as_view(), name="task-stats"),
    path("export", TaskExportView.as_view(), name="task-export"),
]


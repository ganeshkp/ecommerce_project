from django.urls import path
from base.views import chatbot_views as views

urlpatterns = [
    path("", views.postgres_query, name="postgres_query"),
]

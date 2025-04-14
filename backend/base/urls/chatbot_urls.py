from django.urls import path
from base.views import chatbot_views as views

urlpatterns = [
    path("", views.postgres_query_view, name="postgres_query"),
    path("chat-history/", views.get_chat_history, name="get_chat_history"),
    path("save-message/", views.save_chat_message, name="save_chat_message"),
]

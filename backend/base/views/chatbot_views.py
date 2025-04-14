# chatbot/views.py
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from base.utils.chatbot.db_agent import run_db_query
from base.models import ChatMessage
from base.serializers import ChatMessageSerializer


@csrf_exempt  # Disable CSRF validation for this API endpoint
@api_view(["POST"])
# @permission_classes([IsAuthenticated])
def postgres_query_view(request):
    query = request.data.get("query")
    if not query:
        return Response({"error": "Missing query"}, status=400)

    result = run_db_query(query)
    return Response({"response": result})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    messages = ChatMessage.objects.filter(user=request.user)
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_chat_message(request):
    sender = request.data.get("sender")
    message = request.data.get("message")

    if sender and message:
        ChatMessage.objects.create(user=request.user, sender=sender, message=message)
        return Response({"status": "success"})
    return Response(
        {"status": "error", "detail": "Missing sender or message"}, status=400
    )

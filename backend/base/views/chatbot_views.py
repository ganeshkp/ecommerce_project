# chatbot/views.py
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from base.utils.chatbot.db_agent import run_db_query


@csrf_exempt  # Disable CSRF validation for this API endpoint
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def postgres_query(request):
    query = request.data.get("query")
    if not query:
        return Response({"error": "Missing query"}, status=400)

    result = run_db_query(query)
    return Response({"response": result})

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions, status,serializers
from .models import Event,SwapRequest
from .serializers import EventSerializer,SwapRequestSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.dateparse import parse_datetime

#User 
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User registered successfully",
            "user": {"id": user.id, "username": user.username, "email": user.email},
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)

class DeleteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        username = user.username
        user.delete()
        return Response(
            {"message": f"User '{username}' deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )

# class EventListCreateView(generics.ListCreateAPIView):
#     serializer_class = EventSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Event.objects.filter(owner=self.request.user)

#     def perform_create(self, serializer):
#         # Automatically set the owner to the logged-in user
#         serializer.save(owner=self.request.user)

# class EventListCreateView(generics.ListCreateAPIView):
#     serializer_class = EventSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Event.objects.filter(owner=self.request.user)

#     def perform_create(self, serializer):
#         start_time = self.request.data.get("start_time")
#         end_time = self.request.data.get("end_time")

#         # ✅ Overlap check: find any of the user's events that overlap with this one
#         overlapping = Event.objects.filter(
#             owner=self.request.user,
#             start_time__lt=end_time,
#             end_time__gt=start_time
#         ).exists()

#         if overlapping:
#             # ❌ Prevent overlapping events
#             raise serializer.ValidationError(
#                 {"error": "You already have an event during this time."}
#             )

#         # ✅ Save the new event if no overlap
#         serializer.save(owner=self.request.user)
# class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = EventSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         # Only allow operations on the logged-in user's events
#         return Event.objects.filter(owner=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)

    def perform_update(self, serializer):
        start_time = self.request.data.get("start_time")
        end_time = self.request.data.get("end_time")

        overlapping = Event.objects.filter(
            owner=self.request.user,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exclude(id=self.get_object().id).exists()

        if overlapping:
            raise serializer.ValidationError(
                {"error": "This update would overlap with another event."}
            )

        serializer.save()


# class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = EventSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Event.objects.filter(owner=self.request.user)

#     def put(self, request, *args, **kwargs):
#         # Disallow PUT completely
#         return Response(
#             {"detail": "Use PATCH to update an event."},
#             status=status.HTTP_405_METHOD_NOT_ALLOWED
#         )

#     def patch(self, request, *args, **kwargs):
#         # Allow partial updates
#         return super().patch(request, *args, **kwargs)

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)

    def put(self, request, *args, **kwargs):
        # Disallow PUT completely
        return Response(
            {"detail": "Use PATCH to update an event."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def perform_update(self, serializer):
        # ✅ Overlap validation on PATCH
        start_time_str = self.request.data.get("start_time")
        end_time_str = self.request.data.get("end_time")

        # If no time provided in PATCH, skip validation
        if not start_time_str or not end_time_str:
            serializer.save()
            return

        # Convert to datetime objects
        start_time = parse_datetime(start_time_str)
        end_time = parse_datetime(end_time_str)

        if not start_time or not end_time:
            raise serializer.ValidationError({"error": "Invalid datetime format."})

        if start_time >= end_time:
            raise serializer.ValidationError({"error": "End time must be after start time."})

        # Check for overlap with other events of the same user
        overlapping = Event.objects.filter(
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exclude(id=self.get_object().id).exists()

        if overlapping:
            raise serializers.ValidationError(
                {"error": "This update would overlap with another event."}
            )

        serializer.save()

    def patch(self, request, *args, **kwargs):
        # Allow partial updates
        return super().patch(request, *args, **kwargs)


class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        start_time_str = self.request.data.get("start_time")
        end_time_str = self.request.data.get("end_time")

        start_time = parse_datetime(start_time_str)
        end_time = parse_datetime(end_time_str)

        if not start_time or not end_time:
            raise serializers.ValidationError({"error": "Invalid datetime format."})

        if start_time >= end_time:
            raise serializers.ValidationError({"error": "End time must be after start time."})

        overlapping = Event.objects.filter(
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exists()

        if overlapping:
            raise serializers.ValidationError({"error": "Someone or You Already have an event during this time.Request a swap or choose another time."})

        serializer.save(owner=self.request.user)


#Swapable slot view
class SwappableSlotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        slots = Event.objects.filter(status='SWAPPABLE').exclude(owner=request.user)
        serializer = EventSerializer(slots, many=True)
        return Response(serializer.data)


#requesting swap
class SwapRequestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        my_slot_id = request.data.get('my_slot_id')
        their_slot_id = request.data.get('their_slot_id')
        
        try:
            my_slot = Event.objects.get(id=my_slot_id, owner=request.user, status='SWAPPABLE')
            their_slot = Event.objects.get(id=their_slot_id, status='SWAPPABLE')
        except Event.DoesNotExist:
            return Response({"detail": "Invalid slot(s) or not swappable"}, status=status.HTTP_400_BAD_REQUEST)

        swap_request = SwapRequest.objects.create(
            requester=request.user,
            recipient=their_slot.owner,
            my_slot=my_slot,
            their_slot=their_slot,
            status='PENDING'
        )

        # Set both slots to SWAP_PENDING
        my_slot.status = 'SWAP_PENDING'
        their_slot.status = 'SWAP_PENDING'
        my_slot.save()
        their_slot.save()

        serializer = SwapRequestSerializer(swap_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



#Respomding to a swap
class SwapResponseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        accept = request.data.get('accept', False)

        try:
            swap_request = SwapRequest.objects.get(id=request_id, recipient=request.user, status='PENDING')
        except SwapRequest.DoesNotExist:
            return Response({"detail": "Invalid or already responded request"}, status=status.HTTP_400_BAD_REQUEST)

        my_slot = swap_request.my_slot
        their_slot = swap_request.their_slot

        if accept:
            # Swap owners
            my_owner = my_slot.owner
            my_slot.owner = their_slot.owner
            their_slot.owner = my_owner

            # Set status back to BUSY
            my_slot.status = 'BUSY'
            their_slot.status = 'BUSY'
            swap_request.status = 'ACCEPTED'
        else:
            # Revert slots to SWAPPABLE
            my_slot.status = 'SWAPPABLE'
            their_slot.status = 'SWAPPABLE'
            swap_request.status = 'REJECTED'

        my_slot.save()
        their_slot.save()
        swap_request.save()

        serializer = SwapRequestSerializer(swap_request)
        return Response(serializer.data)

class SwapRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Incoming requests (for the logged-in user)
        incoming = SwapRequest.objects.filter(recipient=request.user, status='PENDING')
        incoming_serializer = SwapRequestSerializer(incoming, many=True)

        # Outgoing requests (requests sent by the logged-in user)
        outgoing = SwapRequest.objects.filter(requester=request.user, status='PENDING')
        outgoing_serializer = SwapRequestSerializer(outgoing, many=True)

        return Response({
            "incoming": incoming_serializer.data,
            "outgoing": outgoing_serializer.data
        })



#test for auth
class HelloView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Hello {request.user.username}, your token works!"})

# Debug view to test login
class DebugLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        print(f"Login attempt - Username: {username}, Password: {password}")
        
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        
        if user:
            print(f"Authentication successful for user: {user.username}")
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })
        else:
            print(f"Authentication failed for username: {username}")
            return Response({"error": "Invalid credentials"}, status=401)

# Database test view
class DatabaseTestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from django.db import connection
        from django.contrib.auth.models import User
        
        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                db_status = "Connected"
            
            # Count users
            user_count = User.objects.count()
            
            # Get database info
            db_name = connection.settings_dict.get('NAME', 'Unknown')
            db_engine = connection.settings_dict.get('ENGINE', 'Unknown')
            
            return Response({
                "database_status": db_status,
                "database_engine": db_engine,
                "database_name": db_name,
                "user_count": user_count,
                "users": list(User.objects.values_list('username', flat=True))
            })
        except Exception as e:
            return Response({
                "database_status": "Error",
                "error": str(e)
            }, status=500)

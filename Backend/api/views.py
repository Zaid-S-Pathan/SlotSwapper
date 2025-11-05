from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions, status
from .models import Event,SwapRequest
from .serializers import EventSerializer,SwapRequestSerializer

class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the owner to the logged-in user
        serializer.save(owner=self.request.user)


# class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = EventSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         # Only allow operations on the logged-in user's events
#         return Event.objects.filter(owner=self.request.user)


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

    def patch(self, request, *args, **kwargs):
        # Allow partial updates
        return super().patch(request, *args, **kwargs)

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

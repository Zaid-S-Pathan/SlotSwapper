from rest_framework import serializers
from .models import Event,SwapRequest

# Serializer for Event
class EventSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Event
        fields = ['id', 'owner', 'title', 'start_time', 'end_time', 'status']
        read_only_fields = ['owner']  # owner is always the logged-in user

# Serializer for SwapRequest
class SwapRequestSerializer(serializers.ModelSerializer):
    requester = serializers.ReadOnlyField(source='requester.username')
    recipient = serializers.ReadOnlyField(source='recipient.username')
    my_slot = serializers.PrimaryKeyRelatedField(read_only=True)
    their_slot = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = SwapRequest
        fields = ['id', 'requester', 'recipient', 'my_slot', 'their_slot', 'status', 'created_at']


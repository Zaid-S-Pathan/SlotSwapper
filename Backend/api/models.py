from django.db import models
from django.db import models
from django.contrib.auth.models import User

#this is for the events being marked
class Event(models.Model):
    STATUS_CHOICES = [
        ('BUSY', 'Busy'),
        ('SWAPPABLE', 'Swappable'),
        ('SWAP_PENDING', 'Swap Pending'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='BUSY')

    def __str__(self):
        return f"{self.title} ({self.owner.username})"


#this is for the swap being requested by the other user
class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name="outgoing_requests")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="incoming_requests")
    my_slot = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="offered_swaps")
    their_slot = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="requested_swaps")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.requester.username} → {self.recipient.username} ({self.status})"





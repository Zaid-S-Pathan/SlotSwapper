from django.urls import path
from . import views
from .views import EventListCreateView, EventRetrieveUpdateDestroyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import SwappableSlotsView, SwapRequestCreateView, SwapResponseView,SwapRequestsView, RegisterView


urlpatterns = [
    # JWT Auth endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

 # Event CRUD
    path('events/', EventListCreateView.as_view(), name='events-list-create'),
    path('events/<int:pk>/', EventRetrieveUpdateDestroyView.as_view(), name='events-rud'),

    # Test endpoint
    path('hello/', views.HelloView.as_view(), name='hello'),

    #Swaping
    path('swappable-slots/', SwappableSlotsView.as_view(), name='swappable-slots'),
    path('swap-request/', SwapRequestCreateView.as_view(), name='swap-request'),
    path('swap-response/<int:request_id>/', SwapResponseView.as_view(), name='swap-response'),
    path('swap-requests/', SwapRequestsView.as_view(), name='swap-requests'),

    #user sign up
    path('register/', RegisterView.as_view(), name='register'),
]
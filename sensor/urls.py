from django.urls import path
from .views import IncidentHistoryView, IncidentListView, LastSensorDataView, SensorDataView
from . import views

urlpatterns = [
#     path('data/', SensorDataView.as_view(), name='sensor_data'),
    path('data/', SensorDataView.as_view(), name='sensor_data'),  # GET/POST toutes les données
    path('data/last/', LastSensorDataView.as_view(), name='last_sensor_data'),  # GET dernière donnée
    
    #path("api", api.Dlist, name='json'),
    #path("api/post", api.Dlist, name='json'),
    
    path('api/users/', views.manage_users, name='manage_users'),
    path('api/settings/', views.manage_settings, name='manage_settings'),
    path('api/thresholds/', views.manage_thresholds, name='manage_thresholds'),
    
    path('api/incidents/details/', IncidentListView.as_view(), name='incident_list'),
    path('api/incidents/history/', IncidentHistoryView.as_view(), name='incident_history'),
    path('api/incidents/details/<int:incident_id>/', IncidentListView.as_view(), name='incident-detail'),  # Pour PUT
    
    
]

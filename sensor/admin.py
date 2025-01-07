from django.contrib import admin
from .models import SensorData
from .models import CustomUser, SystemSettings, TemperatureThreshold

@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    list_display = ('temperature', 'humidity', 'date')  # Colonnes affichées


admin.site.register(CustomUser)
admin.site.register(SystemSettings)
admin.site.register(TemperatureThreshold)
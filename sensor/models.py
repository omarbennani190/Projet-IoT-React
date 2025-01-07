from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Group, Permission


class SensorData(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    date = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.date}: {self.temperature}°C, {self.humidity}%"


# class Incident(models.Model):
#     temperature = models.FloatField()
#     detected_at = models.DateTimeField(default=timezone.now)
#     resolved_at = models.DateTimeField(null=True, blank=True)
#     alert_level = models.IntegerField(default=0)

#     def __str__(self):
#         return f"Incident à {self.detected_at} - Temp: {self.temperature}°C"
    
# Custom User Model
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('operateur1', 'Technicien'),
        ('operateur2', 'Manager'),
        ('operateur3', 'Chef de division'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='operateur1')
    phone = models.CharField(max_length=15, blank=True, null=True)
    # Redéfinir les related_name pour éviter les conflits
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",  # Redéfinir la relation inverse
        blank=True,
        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_set",  # Redéfinir la relation inverse
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

# Settings Model
class SystemSettings(models.Model):
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    telegram_token = models.CharField(max_length=255, blank=True, null=True)
    whatsapp_token = models.CharField(max_length=255, blank=True, null=True)

# Temperature Thresholds Model
class TemperatureThreshold(models.Model):
    min_temp = models.FloatField(default=2.0)
    max_temp = models.FloatField(default=8.0)
    

class Incident(models.Model):
    NIVEAU_GRAVITE = [
        ('normal', 'Normal'),
        ('sévère', 'Sévère'),
        ('critique', 'Critique'),
    ]
    
    sensor_data = models.ForeignKey(SensorData, on_delete=models.CASCADE, related_name='incidents')  # Données du capteur associées
    gravite = models.CharField(max_length=10, choices=NIVEAU_GRAVITE)  # Niveau de gravité
    date_debut = models.DateTimeField(null=True, blank=True)  # Date et heure de début de l'incident
    date_fin = models.DateTimeField(null=True, blank=True)  # Date et heure de fin de l'incident
    description = models.TextField(blank=True, null=True)  # Ajouter ce champ
    #operateurs = models.ManyToManyField('Operateur', blank=True)  # Relation ManyToMany avec les opérateurs
    alertes_envoyees = models.IntegerField(default=0)  # Alertes envoyées

    def _str_(self):
        return f"Incident {self.id} - {self.gravite} (Début : {self.date_debut}, Fin : {self.date_fin})"
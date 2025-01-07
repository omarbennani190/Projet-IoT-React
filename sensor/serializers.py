from rest_framework import serializers
from .models import Incident, SensorData, CustomUser, SystemSettings, TemperatureThreshold

# class SensorDataSerializer(serializers.ModelSerializer):
#      class Meta:
#           model = SensorData
#           fields = '__all__'

class SensorDataSerializer(serializers.ModelSerializer):
    gravite = serializers.SerializerMethodField()  # Champ pour la gravité calculée automatiquement

    class Meta:
        model = SensorData
        fields = ['id', 'temperature', 'humidity', 'date', 'gravite']  # Inclure la gravité dans la réponse

    def get_gravite(self, obj):
        if 8 <= obj.temperature <= 16:
            return 'normal'
        elif 6 < obj.temperature < 8 or 16 < obj.temperature <= 18:
            return 'critique'
        else:
            return 'sévère'
        
# Serializer pour les utilisateurs
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'phone', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

# Serializer pour les paramètres système
class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'

# Serializer pour les seuils de température
class TemperatureThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemperatureThreshold
        fields = '__all__'
        

class IncidentHistorySerializer(serializers.ModelSerializer):
    incidentId = serializers.IntegerField(source='id', read_only=True)
    sensor_Id = serializers.IntegerField(source='sensor_data.id', read_only=True)
    temperature = serializers.FloatField(source='sensor_data.temperature', read_only=True) 
    sensor_data = serializers.PrimaryKeyRelatedField(queryset=SensorData.objects.all())

    class Meta:
        model = Incident
        fields = ['incidentId', 'sensor_Id', 'sensor_data', 'gravite', 'date_debut', 'date_fin', 'temperature']



class IncidentListeSerializer(serializers.ModelSerializer):
    alertid = serializers.IntegerField(source='id', read_only=True)
    date = serializers.DateTimeField(source='date_debut', read_only=True)
    alertlevel = serializers.CharField(source='gravite', read_only=True)
    operateur = serializers.CharField(source='operateurs', read_only=True)

    class Meta:
        model = Incident
        fields = ['alertid', 'date', 'alertlevel', 'operateur']
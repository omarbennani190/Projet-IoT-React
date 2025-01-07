import random
import requests
import telepot
from twilio.rest import Client
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Incident, SensorData, CustomUser, SystemSettings, TemperatureThreshold
from .serializers import IncidentHistorySerializer, IncidentListeSerializer, SensorDataSerializer, UserSerializer, SystemSettingsSerializer, TemperatureThresholdSerializer
#*********************************************************
from django.http import HttpResponse
from django.shortcuts import render
from django.utils import timezone
import csv
from django.http import HttpResponse
from django.utils import timezone
from django.http import JsonResponse
from datetime import timedelta
import datetime
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth.forms import UserCreationForm


class SensorDataView(APIView):
    def get(self, request):
        data = SensorData.objects.all()
        serializer = SensorDataSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SensorDataSerializer(data=request.data)
        if serializer.is_valid():
            sensor_data = serializer.save()
            gravite = serializer.data['gravite']

            # Créer un nouvel incident si gravité critique ou sévère
            #if gravite in ['critique', 'sévère']:
            Incident.objects.create(
                    sensor_data=sensor_data,
                    gravite=gravite,
                    date_debut=datetime.now()
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LastSensorDataView(APIView):
    def get(self, request):
        try:
            last_data = SensorData.objects.latest('date')  # Récupère la dernière entrée par date
            serializer = SensorDataSerializer(last_data)
            return Response(serializer.data)
        except SensorData.DoesNotExist:
            return Response({"error": "Aucune donnée trouvée"}, status=404)

#************************************************************************************************

def home(request):
    return render(request, 'home.html')

def table(request):
    derniere_ligne = SensorData.objects.last()

    derniere_date = SensorData.objects.last().dt
    delta_temps = timezone.now() - derniere_date
    difference_minutes = delta_temps.seconds // 60
    temps_ecoule = ' il y a ' + str(difference_minutes) + ' min'

    if difference_minutes > 60:
        temps_ecoule = 'il y ' + str(difference_minutes // 60) + 'h' + str(difference_minutes % 60) + 'min'
    else:
        temps_ecoule = f'il y a {difference_minutes} min'

    valeurs = {
        'date': temps_ecoule,
        'id': derniere_ligne.id,
        'temp': derniere_ligne.temp,
        'hum': derniere_ligne.hum
    }

    return render(request, 'value.html', {'valeurs': valeurs})


def download_csv(request):
    model_values = SensorData.objects.all()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="dht.csv"'
    writer = csv.writer(response)
    writer.writerow(['id', 'temp', 'hum', 'dt'])
    liste = model_values.values_list('id', 'temp', 'hum', 'dt')
    for row in liste:
        writer.writerow(row)
    return response

#pour afficher navbar de template
def index(request):
# def index_view(request):
    return render(request, 'index.html')

#pour afficher les graphes
def graphiqueTemp(request):
    return render(request, 'ChartTemp.html')

# récupérer toutes les valeur de température et humidity sous forme un #fichier json
def graphiqueHum(request):
    return render(request, 'ChartHum.html')

# récupérer toutes les valeur de température et humidity sous forme un #fichier json
def chart_data(request):
    dht = SensorData.objects.all()

    data = {
        'temps': [Dt.dt for Dt in dht],
        'temperature': [Temp.temp for Temp in dht],
        'humidity': [Hum.hum for Hum in dht]
    }
    return JsonResponse(data)

#pour récupérer les valeurs de température et humidité de dernier 24h
# et envoie sous forme JSON
def chart_data_jour(request):
    dht = SensorData.objects.all()
    now = timezone.now()

    # Récupérer l'heure il y a 24 heures
    last_24_hours = now - timezone.timedelta(hours=24)

    # Récupérer tous les objets de Module créés au cours des 24 dernières heures
    dht = SensorData.objects.filter(dt__range=(last_24_hours, now))
    data = {
        'temps': [Dt.dt for Dt in dht],
        'temperature': [Temp.temp for Temp in dht],
        'humidity': [Hum.hum for Hum in dht]
    }
    return JsonResponse(data)

#pour récupérer les valeurs de température et humidité de dernier semaine
# et envoie sous forme JSON
def chart_data_semaine(request):
    dht = SensorData.objects.all()
    # calcul de la date de début de la semaine dernière
    date_debut_semaine = timezone.now().date() - datetime.timedelta(days=7)
    print(datetime.timedelta(days=7))
    print(date_debut_semaine)

    # filtrer les enregistrements créés depuis le début de la semaine dernière
    dht = SensorData.objects.filter(dt__gte=date_debut_semaine)

    data = {
        'temps': [Dt.dt for Dt in dht],
        'temperature': [Temp.temp for Temp in dht],
        'humidity': [Hum.hum for Hum in dht]
    }

    return JsonResponse(data)

#pour récupérer les valeurs de température et humidité de dernier moins
# et envoie sous forme JSON
def chart_data_mois(request):
    dht = SensorData.objects.all()

    date_debut_semaine = timezone.now().date() - datetime.timedelta(days=30)
    print(datetime.timedelta(days=30))
    print(date_debut_semaine)

    # filtrer les enregistrements créés depuis le début de la semaine dernière
    dht = SensorData.objects.filter(dt__gte=date_debut_semaine)

    data = {
        'temps': [Dt.dt for Dt in dht],
        'temperature': [Temp.temp for Temp in dht],
        'humidity': [Hum.hum for Hum in dht]
    }
    return JsonResponse(data)



def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})


def sendtele():
    token = '6662023260:AAG4z48OO9gL8A6szdxg0SOma5hv9gIII1E'
    rece_id = 1242839034
    bot = telepot.Bot(token)
    bot.sendMessage(rece_id, 'la température depasse la normale')
    print(bot.sendMessage(rece_id, 'OK.'))

def send_telegram_alert(message):
    """
    Envoie une alerte via Telegram.
    :param message: Le message à envoyer.
    """
    bot = telepot.Bot('YOUR_TELEGRAM_BOT_TOKEN')
    bot.sendMessage('CHAT_ID', message)
    

#************************************************************************************************
#************************************************************************************************
#************************************************************************************************
#************************************************************************************************

# Gestion des utilisateurs
@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def manage_users(request):
    if request.method == 'GET':
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user_id = request.data.get('id')
        if not user_id:
            return Response({"error": "ID de l'utilisateur non spécifié."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = CustomUser.objects.get(id=user_id)
            user.delete()
            return Response({"message": "Utilisateur supprimé avec succès."}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == 'PUT':
        user_id = request.data.get('id')
        username = request.data.get('username')
        role = request.data.get('role')
        phone = request.data.get('phone')
        
        if not user_id or not username or not role:
            return Response({"error": "Données manquantes : id, username ou role non spécifiés."}, status=status.HTTP_400_BAD_REQUEST)
    
        try:
            user = CustomUser.objects.get(id=user_id)
            data = request.data.copy()
            data['password'] = data.get('password', user.password)  # Conserver le mot de passe actuel si non spécifié
            serializer = UserSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé."}, status=status.HTTP_404_NOT_FOUND)

# Gestion des paramètres
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def manage_settings(request):  #manage_settings users token
    settings = SystemSettings.objects.first()
    if not settings:
        settings = SystemSettings.objects.create()

    if request.method == 'GET':
        settings = SystemSettings.objects.all()
        serializer = SystemSettingsSerializer(settings, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SystemSettingsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        settings_id = request.data.get('id')
        if not settings_id:
            return Response({"error": "ID des paramètres non spécifié."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            settings = SystemSettings.objects.get(id=settings_id)
            serializer = SystemSettingsSerializer(settings, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SystemSettings.DoesNotExist:
            return Response({"error": "Paramètres non trouvés."}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        settings_id = request.data.get('id')
        if not settings_id:
            return Response({"error": "ID des paramètres non spécifié."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            settings = SystemSettings.objects.get(id=settings_id)
            settings.delete()
            return Response({"message": "Paramètres supprimés avec succès."}, status=status.HTTP_200_OK)
        except SystemSettings.DoesNotExist:
            return Response({"error": "Paramètres non trouvés."}, status=status.HTTP_404_NOT_FOUND)

# Gestion des seuils
@api_view(['GET', 'PUT'])
def manage_thresholds(request):
    thresholds = TemperatureThreshold.objects.first()
    if not thresholds:
        thresholds = TemperatureThreshold.objects.create()

    if request.method == 'GET':
        thresholds = TemperatureThreshold.objects.all()
        if not thresholds:
            return Response({"error": "Pas de seuils trouvés."}, status=status.HTTP_404_NOT_FOUND)
        serializer = TemperatureThresholdSerializer(thresholds, many=True)
        return Response(serializer.data)

    
    elif request.method == 'PUT':
        thresholds = TemperatureThreshold.objects.first()
        if not thresholds:
            return Response({"error": "ID des seuils non spécifié."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer = TemperatureThresholdSerializer(thresholds, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TemperatureThreshold.DoesNotExist:
            return Response({"error": "Seuils non trouvés."}, status=status.HTTP_404_NOT_FOUND)


class IncidentHistoryView(APIView):
    # GET : Récupérer l'historique des incidents
    def get(self, request):
        incidents = Incident.objects.all().order_by('-id')  # Trier par date de début (du plus récent au plus ancien)
        print(f"Incidents récupérés: {incidents}")  # Ajoutez ce log
        serializer = IncidentHistorySerializer(incidents, many=True)
        return Response(serializer.data)

    # POST : Créer un nouvel incident
    def post(self, request):
        serializer = IncidentHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IncidentListView(APIView):
    def get(self, request):
        incidents = Incident.objects.all().order_by('-id')
        serializer = IncidentListeSerializer(incidents, many=True)
        return Response(serializer.data)
    
    # PUT : Mettre à jour la date de fin d'un incident
    def put(self, request):
        incident_id = request.data.get('incident_id')
        print(f"Données reçues: {request.data}") 
        if not incident_id:
            return Response({"error": "incident_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            incident = Incident.objects.get(id=incident_id)
            sensor_data = incident.sensor_data  # Récupérer les données du capteur associées à l'incident

            # Mettre à jour la température pour qu'elle soit entre 8 et 16°C
            sensor_data.temperature = round(random.uniform(8, 16))   # Vous pouvez choisir une valeur fixe ou aléatoire entre 8 et 16
            sensor_data.save()  # Sauvegarder les modifications des données du capteur

            # Mettre à jour la date de fin et la description de l'incident
            incident.date_fin = timezone.now()
            incident.description = request.data.get("description", "")
            incident.gravite = 'normal'  # Définir la gravité sur "normal"
            incident.save()

            serializer = IncidentHistorySerializer(incident, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Incident.DoesNotExist:
            return Response({"error": "Incident non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        
        

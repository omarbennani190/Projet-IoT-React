import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { SensorDataContext } from "./SensorDataContext";
import { Grid, Card, CardContent, Typography, Button, Box, Paper, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Icône pour le temps écoulé
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Icône pour la date

function LastDataDisplay() {
  const { sensorData, lastData, stats } = useContext(SensorDataContext); // Récupération correcte des données
  const { maxTempToday, minTempToday, maxHumidityToday, minHumidityToday } = stats; // Déstructuration des stats

  const [isTempModalOpen, setIsTempModalOpen] = useState(false);
  const [isHumidityModalOpen, setIsHumidityModalOpen] = useState(false);

  const tempData = (sensorData || []).map((item) => ({ date: item.date, value: item.temperature }));
  const humidityData = (sensorData || []).map((item) => ({ date: item.date, value: item.humidity }));

  console.log("tempData display :", lastData);


  const [elapsedTime, setElapsedTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (lastData?.date) {
      const interval = setInterval(() => {
        const now = new Date();
        const recordedTime = new Date(lastData.date);
        const diffInMs = now - recordedTime;

        const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

        setElapsedTime(
          `${days > 0 ? `${days} jours, ` : ""}
          ${hours > 0 ? `${hours} heures, ` : ""}
          ${minutes} minutes`
        );
      }, 60000);

      return () => clearInterval(interval);
    } else {
      setElapsedTime(""); // Réinitialisation si aucune date
    }
  }, [lastData]);

  if (!lastData) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography variant="h6" color="textSecondary">
          Aucune donnée disponible
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" mb={4} gutterBottom>
        Données du capteur
      </Typography>

      {/* Section stylisée pour la date et le temps écoulé */}
      <Box mt={5} display="flex" justifyContent="center">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', maxWidth: '800px', width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Informations temporelles
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Date :</strong> {new Date(lastData.date).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon color="secondary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  <strong>Il y a :</strong> {elapsedTime || "Calcul en cours..."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Section des cartes pour la température et l'humidité */}
      <Grid container justifyContent="center" mt={1} spacing={2}>
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
            <CardContent align="center">
              <Box display="flex" justifyContent={"center"} alignItems="center" mb={2}>
                <span className="icon-thermometer"></span>
                <Typography variant="h3" color="primary">
                  Température
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {lastData.temperature}°C
              </Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff2323', '&:hover': { backgroundColor: '#cc1c1c' } }}
                  onClick={() => navigate("/graphes/temperature")}
                >
                  📊 Voir le graphique
                </Button>
              </Box>
              <Box mt={2}>
                <Typography variant="body2">
                  <strong>Température Max (aujourd'hui) :</strong> {maxTempToday || "N/A"}°C
                </Typography>
                <Typography variant="body2">
                  <strong>Température Min (aujourd'hui) :</strong> {minTempToday || "N/A"}°C
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
            <CardContent align="center">
              <Box display="flex" justifyContent={"center"} alignItems="center" mb={2}>
                <span className="icon-water-drop"></span>
                <Typography variant="h3" color="primary" gutterBottom>
                  Humidité
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {lastData.humidity}%
              </Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#36a2eb', '&:hover': { backgroundColor: '#2b8acf' } }}
                  onClick={() => navigate("/graphes/humidite")}
                >
                  📊 Voir le graphique
                </Button>
              </Box>
              <Box mt={2}>
                <Typography variant="body2">
                  <strong>Humidité Max (aujourd'hui) :</strong> {maxHumidityToday || "N/A"}%
                </Typography>
                <Typography variant="body2">
                  <strong>Humidité Min (aujourd'hui) :</strong> {minHumidityToday || "N/A"}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>

  );
}

export default LastDataDisplay;
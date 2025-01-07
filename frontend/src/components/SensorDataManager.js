// src/components/SensorDataManager.js
import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";


export const SensorDataContext = createContext();

export const SensorDataManager = ({ children }) => {
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [date, setDate] = useState("");


  const [allData, setAllData] = useState([]);
  const [lastData, setLastData] = useState(null);
  const [stats, setStats] = useState({
    maxTempToday: null,
    minTempToday: null,
    maxHumidityToday: null,
    minHumidityToday: null,
  });

  // Utilisation de useCallback pour éviter de redéfinir les fonctions à chaque rendu
  const fetchLastData = useCallback(() => {
    axios
      .get("http://192.168.124.93:8000/data/last/")
      .then((response) => setLastData(response.data))
      .catch((error) => console.error("Erreur lors de la récupération :", error));
  }, [setLastData]);

  const fetchStats = useCallback(() => {
    axios
      .get("http://192.168.124.93:8000/data/")
      .then((response) => {
        const data = response.data;

        // Filtrer les données pour la journée actuelle
        const today = new Date();
        const todayData = data.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getFullYear() === today.getFullYear() &&
            itemDate.getMonth() === today.getMonth() &&
            itemDate.getDate() === today.getDate()
          );
        });

        // Calculer la température max et min
        const temperatures = todayData.map((item) => item.temperature);
        // Calculer l'humidité max et min
        const humidities = todayData.map((item) => item.humidity);
        const stats = {
          maxTempToday: Math.max(...temperatures),
          minTempToday: Math.min(...temperatures),
          maxHumidityToday: Math.max(...humidities),
          minHumidityToday: Math.min(...humidities),
        };

        setStats(stats); // Mettre à jour les statistiques
      })
      .catch((error) => console.error("Erreur lors de la récupération :", error));
  }, []);

  const fetchAllData = useCallback(() => {
    axios
      .get("http://192.168.124.93:8000/data/")
      .then((response) => setAllData(response.data))
      .catch((error) => console.error("Erreur lors de la récupération :", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://192.168.124.93:8000/data/", {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
      })
      .then(() => {
        fetchLastData();
        setTemperature("");
        setHumidity("");
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement :", error);
      });
  };

  useEffect(() => {
    fetchLastData();
    fetchStats();
    fetchAllData();
  }, [fetchLastData, fetchStats, fetchAllData]); // Ajouter les fonctions mémorisées comme dépendances



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des données des capteurs
      </Typography>

      {/* Formulaire pour soumettre les données */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Ajouter des données
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Température (°C)"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Humidité (%)"
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Date et Heure"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Soumettre
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Affichage des statistiques */}
      {/* <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Statistiques du Jour
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography variant="body1">
              Température Max: {stats.maxTempToday ?? "N/A"} °C
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body1">
              Température Min: {stats.minTempToday ?? "N/A"} °C
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body1">
              Humidité Max: {stats.maxHumidityToday ?? "N/A"} %
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body1">
              Humidité Min: {stats.minHumidityToday ?? "N/A"} %
            </Typography>
          </Grid>
        </Grid>
      </Paper> */}

      {/* Affichage des dernières données */}
      {/* <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dernières Données
        </Typography>
        {lastData ? (
          <Box>
            <Typography variant="body1">
              Température: {lastData.temperature} °C
            </Typography>
            <Typography variant="body1">
              Humidité: {lastData.humidity} %
            </Typography>
            <Typography variant="body1">
              Date: {new Date(lastData.date).toLocaleString()}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1">Aucune donnée disponible</Typography>
        )}
      </Paper> */}

      {/* Affichage de toutes les données dans un tableau */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Toutes les données
        </Typography>
        <TableContainer>
          <Table sx={{ borderCollapse: 'collapse' }}>
            {/* En-têtes du tableau */}
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
                  Température (°C)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
                  Humidité (%)
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Corps du tableau */}
            <TableBody>
              {allData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell sx={{ border: '1px solid #ddd' }}>
                    {new Date(data.date).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd' }}>
                    {data.temperature}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd' }}>
                    {data.humidity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Provide context to child components */}
      <SensorDataContext.Provider value={{ allData, lastData, stats, fetchLastData, fetchStats, fetchAllData }}>
        {children} {/* Render children components inside the context provider */}
      </SensorDataContext.Provider>
    </Box>
  );
};

export default SensorDataManager;

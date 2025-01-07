// src/components/SensorDataContext.js
import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

// Create the context for sharing sensor data
export const SensorDataContext = createContext();

// Create the provider component
export const SensorDataProvider = ({ children }) => {
     // const [temperature, setTemperature] = useState("");
     // const [humidity, setHumidity] = useState("");
     const [sensorData, setSensorData] = useState([]);
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
               .then((response) => setSensorData(response.data))
               .catch((error) => console.error("Erreur lors de la récupération :", error));
     }, []);

     // const handleSubmit = (e) => {
     //      e.preventDefault();
     //      axios
     //           .post("http://192.168.124.93:8000/data/", {
     //                temperature: parseFloat(temperature),
     //                humidity: parseFloat(humidity),
     //           })
     //           .then(() => {
     //                fetchLastData();
     //                setTemperature("");
     //                setHumidity("");
     //           })
     //           .catch((error) => {
     //                console.error("Erreur lors de l'enregistrement :", error);
     //           });
     // };

     useEffect(() => {
          fetchLastData();
          fetchStats();
          fetchAllData();
     }, [fetchLastData, fetchStats, fetchAllData]); // Ajouter les fonctions mémorisées comme dépendances



     return (
          <SensorDataContext.Provider value={{ sensorData, lastData, stats, setSensorData, setLastData, setStats }}>
               {children}
          </SensorDataContext.Provider>
     );
};


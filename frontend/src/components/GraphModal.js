import React, { useState, useMemo, useEffect, useContext } from "react";
import { SensorDataContext } from './SensorDataContext';
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart, TimeScale, LineElement, PointElement, LinearScale, Title, Tooltip, Filler } from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from 'chartjs-plugin-zoom';
import { format, parseISO, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Typography, Button, Select, MenuItem, Paper, Grid, TextField } from '@mui/material';

Chart.register(TimeScale, LineElement, PointElement, LinearScale, Title, Tooltip, Filler, zoomPlugin);

function GraphModal({ isOpen, onClose, title }) {
  const { sensorData } = useContext(SensorDataContext);

  const [timeRange, setTimeRange] = useState(24);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = useMemo(() => {
    return sensorData.filter((item) => {
      const itemDate = parseISO(item.date);
      if (!isValid(itemDate)) return false;

      if (startDate && endDate) {
        return itemDate.getTime() >= startDate.getTime() && itemDate.getTime() <= endDate.getTime();
      }

      return isValid(itemDate) && now - itemDate <= timeRange * 60 * 60 * 1000;
    });
  }, [sensorData, timeRange, startDate, endDate, now]);

  const downloadCSV = () => {
    const rows = [
      ["Date", title === "Température" ? "Température (°C)" : "Humidité (%)"],
      ...filteredData.map((item) => [
        format(parseISO(item.date), "yyyy-MM-dd 'à' HH:mm:ss"),
        title === "Température" ? item.temperature : item.humidity,
      ]),
    ];

    const csvContent = rows.map((row) => row.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}_data.csv`;
    link.click();
  };

  if (!isOpen) return null;

  const chartData = {
    labels: filteredData.map((item) => {
      const date = parseISO(item.date);
      return isValid(date) ? date : null;
    }).filter((date) => date !== null),
    datasets: [
      {
        label: title === "Température" ? "Température (°C)" : "Humidité (%)",
        data: filteredData.map((item) => (title === "Température" ? item.temperature : item.humidity)).filter((value) => !isNaN(value)),
        borderColor: title === "Température" ? "rgb(241, 8, 8)" : "#36a2eb",
        backgroundColor: title === "Température" ? "rgba(255, 99, 132, 0.2)" : "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        legend: { display: true },
        title: { display: true, text: title === "Température" ? "Température (°C)" : "Humidité (%)" },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeRange <= 2 ? "minute" : "hour",
          tooltipFormat: "HH:mm",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          callback: function (value, index, values) {
            const date = new Date(value);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const period = hours < 12 ? "matin" : "soir";
            if (timeRange <= 2) {
              return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${period}`;
            } else {
              return `${hours % 12 || 12} ${period}`;
            }
          },
        },
        title: {
          display: true,
          text: "Temps",
        },
        min: filteredData.length > 0 ? new Date(filteredData[0].date).getTime() : null,
        max: now.getTime(),
      },
      y: {
        beginAtZero: true,
        min: Math.min(...chartData.datasets[0].data) - 5,
        max: Math.max(...chartData.datasets[0].data) + 5,
        title: { display: true, text: title === "Température" ? "Température (°C)" : "Humidité (%)" },
      },
    },
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Graphe {title}
        </Typography>

        {/* Section pour la plage de temps et le téléchargement CSV */}
        <Grid container spacing={2} alignItems="center" mb={3} ml={16}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ mr: 2 }}>
                Plage de temps :
              </Typography>
              <Select
                value={timeRange}
                sx={{ height: '46px', width: '250px' }}
                onChange={(e) => {
                  setTimeRange(Number(e.target.value));
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                <MenuItem value={2}>Dernières 2 heures</MenuItem>
                <MenuItem value={6}>Dernières 6 heures</MenuItem>
                <MenuItem value={12}>Dernières 12 heures</MenuItem>
                <MenuItem value={24}>Dernières 24 heures</MenuItem>
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="success"
              onClick={downloadCSV}
              sx={{ height: '46px', width: '250px' }} // Ajuster la hauteur pour correspondre au Select
            >
              Télécharger CSV
            </Button>
          </Grid>
        </Grid>

        {/* Section pour les sélecteurs de date */}
        <Grid container spacing={2} mb={3} ml={16}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" justifyContent={"space-around"} sx={{ height: '46px', width: '350px' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Date de début :
              </Typography>
              <DatePicker
                sx={{ height: '46px', width: '250px' }}
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setTimeRange(0);
                }}
                customInput={<TextField fullWidth />}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
                placeholderText="Choisissez une date"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ mr: 2 }}>
                Date de fin :
              </Typography>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  setTimeRange(0);
                }}
                customInput={<TextField fullWidth />}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="yyyy-MM-dd"
                placeholderText="Choisissez une date"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Graphique */}
        {/* Graphique avec une largeur minimisée */}
        <Box mt={2} sx={{ width: '80%', margin: '0 auto' }}> {/* Largeur réduite à 80% et centrée */}
          <Line data={chartData} options={options} />
        </Box>

        {/* Bouton de retour */}
        <Box mt={3} display="flex" justifyContent="center">
          {/* <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </Button> */}
        </Box>
      </Paper>
    </Box>
  );
}

export default GraphModal;
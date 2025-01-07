// src/App.js
import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import NavigationButtons from './components/NavigationButtons';
import LastDataDisplay from "./components/LastDataDisplay";
import { Routes, Route } from 'react-router-dom';
import GraphModal from "./components/GraphModal";
import AdminPanel from "./components/AdminPanel";
import SensorDataManager from "./components/SensorDataManager";
import IncidentDetails from './components/IncidentDetails'; 
import IncidentHistory from "./components/IncidentHistory";
import SensorForm from './components/SensorForm';
import MessageManager from "./components/MessageManager";
import axios from "axios";
// import { SensorDataProvider } from './components/SensorDataContext';


// function App() {

//   const [temperature, setTemperature] = useState("");
//   const [humidity, setHumidity] = useState("");

//   const [allData, setAllData] = useState([]);
//   const [lastData, setLastData] = useState(null);
//   const [stats, setStats] = useState({
//     maxTempToday: null,
//     minTempToday: null,
//     maxHumidityToday: null,
//     minHumidityToday: null,
//   });

//     // Utilisation de useCallback pour éviter de redéfinir les fonctions à chaque rendu
//     const fetchLastData = useCallback(() => {
//       axios
//         .get("http://192.168.124.93:8000/data/last/")
//         .then((response) => setLastData(response.data))
//         .catch((error) => console.error("Erreur lors de la récupération :", error));
//     }, [setLastData]);
  
//     const fetchStats = useCallback(() => {
//       axios
//         .get("http://192.168.124.93:8000/data/")
//         .then((response) => {
//           const data = response.data;
  
//           // Filtrer les données pour la journée actuelle
//           const today = new Date();
//           const todayData = data.filter((item) => {
//             const itemDate = new Date(item.date);
//             return (
//               itemDate.getFullYear() === today.getFullYear() &&
//               itemDate.getMonth() === today.getMonth() &&
//               itemDate.getDate() === today.getDate()
//             );
//           });
  
//           // Calculer la température max et min
//           const temperatures = todayData.map((item) => item.temperature);
//           // Calculer l'humidité max et min
//           const humidities = todayData.map((item) => item.humidity);
//           const stats = {
//             maxTempToday: Math.max(...temperatures),
//             minTempToday: Math.min(...temperatures),
//             maxHumidityToday: Math.max(...humidities),
//             minHumidityToday: Math.min(...humidities),
//           };
  
//           setStats(stats); // Mettre à jour les statistiques
//         })
//         .catch((error) => console.error("Erreur lors de la récupération :", error));
//     }, []);
  
//     const fetchAllData = useCallback(() => {
//       axios
//         .get("http://192.168.124.93:8000/data/")
//         .then((response) => setAllData(response.data))
//         .catch((error) => console.error("Erreur lors de la récupération :", error));
//     }, []);
    
    
//   useEffect(() => {
//     fetchLastData();
//     fetchStats();
//     fetchAllData();
//   }, [fetchLastData, fetchStats, fetchAllData]); // Ajouter les fonctions mémorisées comme dépendances


//   return (
//     <div className="app-container">

//       {/* Navigation avec boutons */}
//       <NavigationButtons />

//       {/* Routes */}
//       <Routes>
//         <Route path="/" element={<LastDataDisplay />} />
//         {/* <Route path="/" element={<Dashboard />} /> */}
//         <Route path="/graphes/temperature" element={<GraphModal isOpen={true} title="Température" />} />
//         <Route path="/graphes/humidite" element={<GraphModal isOpen={true} title="Humidité" />} />
//         <Route path="/admin" element={<AdminPanel />} />
//         <Route path="/gestion-capteurs" element={<SensorDataManager />} />
//         <Route
//             path="/"
//             element={
//               <>
//                 <SensorForm
//                   fetchLastData={fetchLastData}
//                   setTemperature={setTemperature}
//                   setHumidity={setHumidity}
//                 />
//                 <LastDataDisplay lastData={lastData} tempStats={stats} allData={allData} />
//               </>
//             }
//           />
          
//           {/* Autres pages */}
//           <Route path="/incidents/history" element={<IncidentHistory />} />
//           <Route path="/incidents/details/" element={<IncidentDetails/>} />
//       </Routes>
      
//     </div>
//   );
// }

// export default App;



import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#4d47c6', // Couleur de fond de la barre de navigation
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

    const [temperature, setTemperature] = useState("");
    const [humidity, setHumidity] = useState("");

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
      
      
    useEffect(() => {
      fetchLastData();
      fetchStats();
      fetchAllData();
    }, [fetchLastData, fetchStats, fetchAllData]); // Ajouter les fonctions mémorisées comme dépendances



  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ 
              mr: 2, 
              color: '#fff',
              ...(open && { display: 'none' }),
              '& .MuiSvgIcon-root': { color: '#fff' } // Force la couleur de l'icône à blanc
            }}
          >
            <MenuIcon style={{ color: '#fff' }} />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Gestion des données du frigo
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#0a1229', // Couleur de fond de la sidebar
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#fff' }}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* Utilisation de NavigationButtons */}
        <NavigationButtons />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<LastDataDisplay />} /> {/* Route pour la page d'accueil */}
          
          <Route path="/graphes/temperature" element={<GraphModal isOpen={true} title="Température" />} />
          <Route path="/graphes/humidite" element={<GraphModal isOpen={true} title="Humidité" />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/gestion-capteurs" element={<SensorDataManager />} />
          <Route
              path="/"
              element={
                <>
                  <SensorForm
                    fetchLastData={fetchLastData}
                    setTemperature={setTemperature}
                    setHumidity={setHumidity}
                  />
                  <LastDataDisplay lastData={lastData} tempStats={stats} allData={allData} />
                </>
              }
            />
          
            {/* Autres pages */}
            <Route path="/incidents/history" element={<IncidentHistory />} />
            <Route path="/incidents/details/" element={<IncidentDetails/>} />
            {/* <Route path="/gestion-messages" element={<MessageManager />} /> */}
        </Routes>
      </Main>
    </div>
  );
}
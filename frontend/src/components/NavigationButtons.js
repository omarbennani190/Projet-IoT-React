import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';

const SidebarContainer = styled('div')({
  width: '100%', // Prend toute la largeur de la sidebar
  height: '100vh',
  backgroundColor: '#0a1229',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const NavButton = styled('button')(({ isActive }) => ({
  width: '100%',
  padding: '12px 16px',
  margin: '8px 0',
  borderRadius: '8px',
  backgroundColor: isActive ? '#5850e8' : 'transparent',
  color: isActive ? '#fff' : '#9fa8da',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background-color 0.3s, color 0.3s',
  '&:hover': {
    backgroundColor: '#5850e8',
    color: '#fff',
  },
}));

const Icon = styled('span')({
  marginRight: '12px',
  fontSize: '18px',
});

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { path: "/", label: "Dernières Données", icon: "📈" },
    { path: "/graphes/temperature", label: "Graphes Température", icon: "🌡️" },
    { path: "/graphes/humidite", label: "Graphes Humidité", icon: "💧" },
    { path: "/admin", label: "Interface Admin", icon: "🛠️" },
    { path: "/gestion-capteurs", label: "Gestion des Capteurs", icon: "📡" },
    { path: "/incidents/history", label: "Historique des Incidents", icon: "📜" },
    { path: "/incidents/details", label: "Détails des Incidents", icon: "🔍" },
    // { path: "/gestion-messages", label: "Gestion des Messages", icon: "📨" }, 
  ];

  const handleNavigation = (path) => {
     if (path === "/") {
       navigate("/");
       window.location.reload(); // Recharge la page après la navigation
     } else {
       navigate(path);
     }
   };

  return (
    <SidebarContainer>
      {buttons.map((button) => (
        <NavButton
          key={button.path}
          onClick={() => handleNavigation(button.path)}
          isActive={location.pathname === button.path}
        >
          <Icon>{button.icon}</Icon>
          {button.label}
        </NavButton>
      ))}
    </SidebarContainer>
  );
};

export default NavigationButtons;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { styled } from '@mui/system';


// const NavigationButtons = () => {
//      const navigate = useNavigate();

//      const handleSubmit = () => {
//           navigate("/");

//           // Rechargez la page après l'action
//           window.location.reload();
//      };
//      return (
//           <div className="admin-button-container">
//                <div className="admin-button">
//                     <button onClick={handleSubmit} className="nav-button">
//                          Dernières Données
//                     </button>
//                </div>
//                <div className="admin-button">
//                     <button onClick={() => navigate("/graphes/temperature")} className="nav-button">
//                          Graphes Température
//                     </button>
//                </div>
//                <div className="admin-button">
//                     <button onClick={() => navigate("/graphes/humidite")} className="nav-button">
//                          Graphes Humidité
//                     </button>
//                </div>
//                <div className="admin-button">
//                     <button onClick={() => navigate("/admin")} className="nav-button">
//                          Interface Admin
//                     </button>
//                </div>
//                <div className="admin-button">
//                     <button onClick={() => navigate("/gestion-capteurs")} className="nav-button">
//                          Gestion des Capteurs
//                     </button>
//                </div>

//                <div className="admin-button">
//                     <button onClick={() => navigate("/incidents/history")} className="nav-button">
//                          Historique des Incidents
//                     </button>
//                </div>
//                <div className="admin-button">
//                     <button onClick={() => navigate("/incidents/details")} className="nav-button">
//                          Détails des Incidents
//                     </button>
//                </div>
//           </div>
//      );
// };

// export default NavigationButtons;
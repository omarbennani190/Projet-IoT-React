import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  TablePagination,
} from "@mui/material";

function IncidentHistory() {
  const [incidents, setIncidents] = useState([]);
  //pagination 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get("http://192.168.124.93:8000/api/incidents/history/")
      .then((response) => {
        console.log("Réponse de l'API:", response.data); // Ajoutez ce log
        setIncidents(response.data);
      })
      .catch((error) => console.error("Erreur lors de la récupération :", error));
  }, []);

  // Fonction pour déterminer la couleur en fonction de la gravité
  const getSeverityColor = (gravite) => {
    switch (gravite) {
      case "normal":
        return "success"; // Vert pour normal
      case "sévère":
        return "warning"; // Orange pour sévère
      case "critique":
        return "error"; // Rouge pour critique
      default:
        return "default"; // Gris par défaut
    }
  };

  console.log("données des incidents", incidents);



  // Gestion du changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Gestion du changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Réinitialiser la page à 0 lorsque le nombre de lignes par page change
  };

  // Calcul des incidents à afficher pour la page actuelle
  const paginatedIncidents = incidents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Historique des Incidents
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                ID Incident
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                ID Capteur
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Température
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Gravité
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Date de Début
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Date de Fin
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Détails
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedIncidents.map((incident, index) => (
              <TableRow key={`${incident.incidentId}-${index}`}>
                <TableCell sx={{ border: "1px solid #ddd" }}>{incident.incidentId}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>{incident.sensor_Id}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>{incident.temperature}°C</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <Chip
                    label={incident.gravite}
                    color={getSeverityColor(incident.gravite)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {new Date(incident.date_debut).toLocaleString()}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {incident.date_fin
                    ? new Date(incident.date_fin).toLocaleString()
                    : "En cours"}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <Link
                    to={`/incidents/details/`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Chip label="Voir" clickable color="primary" variant="outlined" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={incidents.length} // Nombre total d'incidents
        rowsPerPage={rowsPerPage} // Nombre de lignes par page
        page={page} // Page actuelle
        onPageChange={handleChangePage} // Gestion du changement de page
        onRowsPerPageChange={handleChangeRowsPerPage} // Gestion du changement du nombre de lignes par page
        labelRowsPerPage="Lignes par page" // Texte en français
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} sur ${count}` // Texte en français pour l'affichage des lignes
        }
      />
    </Box>
  );
}

export default IncidentHistory;
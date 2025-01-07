import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
  TextField,
  Button,
  Chip,
  TablePagination,
  CircularProgress,
} from "@mui/material";

const IncidentsDetails = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState({});
  const [showTextarea, setShowTextarea] = useState({});


  const [page, setPage] = useState(0); // Page actuelle
  const [rowsPerPage, setRowsPerPage] = useState(5); // Nombre de lignes par page

  const fetchIncidents = async () => {
    try {
      const response = await axios.get("http://192.168.124.93:8000/api/incidents/details/");
      const sortedIncidents = response.data.sort((a, b) => b.alertid - a.alertid);
      setIncidents(sortedIncidents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (incidentId, message) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [incidentId]: message,
    }));
  };

  const handleResolveIncident = async (incidentId) => {
    const message = messages[incidentId];

    if (!message?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Message requis',
        text: 'Veuillez remplir le message avant de résoudre l\'incident.',
      });
      return;
    }

    try {
      await axios.put(`http://192.168.124.93:8000/api/incidents/details/${incidentId}/`, {
        description: message,
      });

      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.alertid === incidentId
            ? { ...incident, date_fin: new Date().toISOString(), alertlevel: 'normal' }
            : incident
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Incident résolu',
        text: 'L\'incident a été résolu avec succès !',
      });
    } catch (error) {
      console.error("Erreur lors de la résolution de l'incident :", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la résolution de l\'incident.',
      });
    }
  };

  const toggleTextarea = (incidentId) => {
    setShowTextarea((prev) => ({
      ...prev,
      [incidentId]: !prev[incidentId],
    }));
  };


  const getSeverityClass = (gravite) => {
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

  useEffect(() => {
    fetchIncidents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Erreur : {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Détails des Incidents
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                ID Incident
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Incidents
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Opérateur
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedIncidents.map((incident) => (
              <TableRow key={incident.alertid}>
                <TableCell sx={{ border: "1px solid #ddd" }}>{incident.alertid}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {incident.date_fin ? new Date(incident.date_fin).toLocaleString() : "En cours"}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <Chip
                    label={incident.alertlevel}
                    color={getSeverityClass(incident.alertlevel)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {incident.operateur || "Non spécifié"}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {(incident.alertlevel === "sévère" || incident.alertlevel === "critique") &&
                    !incident.date_fin && (
                      <Box>
                        {showTextarea[incident.alertid] ? (
                          <>
                            <TextField
                              value={messages[incident.alertid] || ""}
                              onChange={(e) => handleMessageChange(incident.alertid, e.target.value)}
                              placeholder="Saisissez votre message"
                              multiline
                              rows={2}
                              fullWidth
                              sx={{ mb: 1 }}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleResolveIncident(incident.alertid)}
                            >
                              Confirmer
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => toggleTextarea(incident.alertid)}
                          >
                            Résoudre
                          </Button>
                        )}
                      </Box>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination avec texte en français */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Options pour le nombre de lignes par page
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
};

export default IncidentsDetails;
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Paper,
  TableCell,
  TableRow,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    telegramToken: "",
    whatsappToken: "",
  });
  const [thresholds, setThresholds] = useState({
    minTemp: 2,
    maxTemp: 8,
  });

  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    role: "operateur1",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchSettings();
    fetchThresholds();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://192.168.124.93:8000/api/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error.response?.data || error.message);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get("http://192.168.124.93:8000/api/settings/");
      setSettings(response.data || { email: "", phone: "", telegramToken: "", whatsappToken: "" });
    } catch (error) {
      console.error("Failed to fetch settings:", error.response?.data || error.message);
    }
  };

  const fetchThresholds = async () => {
    try {
      const response = await axios.get("http://192.168.124.93:8000/api/thresholds/");
      setThresholds(response.data || { minTemp: 2, maxTemp: 8 });
    } catch (error) {
      console.error("Failed to fetch thresholds:", error.response?.data || error.message);
    }
  };

  const handleUserCreate = async () => {
    try {
      await axios.post("http://192.168.124.93:8000/api/users/", newUser);
      fetchUsers();
      setNewUser({ username: "", role: "operateur1", email: "", phone: "", password: "" });
    } catch (error) {
      console.error("Failed to create user:", error.response?.data || error.message);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      await axios.delete("http://192.168.124.93:8000/api/users/", {
        data: { id: userId },
        headers: { "Content-Type": "application/json" },
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error.response?.data || error.message);
    }
  };

  const handleUserDeleteConfirmation = (userId) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement l'utilisateur.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        handleUserDelete(userId);
      }
    });
  };

  const handleUserUpdate = async () => {
    try {
      await axios.put(`http://192.168.124.93:8000/api/users/`, {
        id: editingUser.id,
        username: editingUser.username,
        role: editingUser.role,
        email: editingUser.email,
        phone: editingUser.phone,
        password: editingUser.password,
      });
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // const handleSettingsUpdate = async () => {
  //   try {
  //     await axios.put("http://192.168.124.93:8000/api/settings/", settings, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     alert("Settings updated successfully!");
  //   } catch (error) {
  //     console.error("Failed to update settings:", error.response?.data || error.message);
  //   }
  // };

  const handleThresholdsUpdate = async () => {
    try {
      await axios.put(
        "http://192.168.124.93:8000/api/thresholds/",
        { min_temp: thresholds.minTemp, max_temp: thresholds.maxTemp }
      );
      // Utilisation de SweetAlert pour afficher un message de succès
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Les seuils ont été mis à jour avec succès!',
      });
    } catch (error) {
      console.error("Failed to update thresholds:", error.response.data || error.message);
      // Utilisation de SweetAlert pour afficher un message d'erreur
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Échec de la mise à jour des seuils. Veuillez réessayer.',
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gérer les utilisateurs
      </Typography>

      {/* User Management */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>

        <Grid container spacing={2}>
          {/* Formulaire d'ajout/modification d'utilisateur */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
            </Typography>

            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={editingUser ? editingUser.username : newUser.username}
              onChange={(e) => {
                const value = e.target.value;
                if (editingUser) setEditingUser({ ...editingUser, username: value });
                else setNewUser({ ...newUser, username: value });
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={(e) => {
                const value = e.target.value;
                if (editingUser) setEditingUser({ ...editingUser, email: value });
                else setNewUser({ ...newUser, email: value });
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Téléphone"
              value={editingUser ? editingUser.phone : newUser.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (editingUser) setEditingUser({ ...editingUser, phone: value });
                else setNewUser({ ...newUser, phone: value });
              }}
              sx={{ mb: 2 }}
            />

            <Select
              fullWidth
              value={editingUser ? editingUser.role : newUser.role}
              onChange={(e) => {
                const value = e.target.value;
                if (editingUser) setEditingUser({ ...editingUser, role: value });
                else setNewUser({ ...newUser, role: value });
              }}
              sx={{ mb: 2 }}
            >
              <MenuItem value="operateur1">Operateur 1 (Technicien)</MenuItem>
              <MenuItem value="operateur2">Operateur 2 (Manager)</MenuItem>
              <MenuItem value="operateur3">Operateur 3 (Chef de division)</MenuItem>
            </Select>

            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={editingUser ? editingUser.password : newUser.password}
              onChange={(e) => {
                const value = e.target.value;
                if (editingUser) setEditingUser({ ...editingUser, password: value });
                else setNewUser({ ...newUser, password: value });
              }}
              sx={{ mb: 2 }}
            />

            {!editingUser ? (
              <Button variant="contained" onClick={handleUserCreate}>
                Créer
              </Button>
            ) : (
              <Button variant="contained" onClick={handleUserUpdate}>
                Modifier
              </Button>
            )}
          </Grid>


        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Liste des utilisateurs
        </Typography>

        <TableContainer>
          <Table sx={{ borderCollapse: 'collapse' }}>
            {/* En-têtes du tableau */}
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', border: '1px solid #ddd' }}>
                  Nom d'utilisateur
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', border: '1px solid #ddd' }}>
                  Rôle
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', border: '1px solid #ddd' }}>
                  Email
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', border: '1px solid #ddd' }}>
                  Téléphone
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', border: '1px solid #ddd' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Corps du tableau */}
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ border: '1px solid #ddd' }}>{user.username}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd' }}>{user.role}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd' }}>{user.email}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd' }}>{user.phone}</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ddd' }}>
                    {/* Bouton Modifier (jaune foncé) */}
                    <IconButton
                      onClick={() => setEditingUser(user)}
                      sx={{ color: '#FFA500', '&:hover': { backgroundColor: 'rgba(255, 165, 0, 0.1)' } }}
                    >
                      <Edit />
                    </IconButton>

                    {/* Bouton Supprimer (rouge) */}
                    <IconButton
                      onClick={() => handleUserDeleteConfirmation(user.id)}
                      sx={{ color: '#FF0000', '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' } }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Thresholds Management */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Modifier les seuils de température
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Température minimale"
              type="number"
              value={thresholds.minTemp || 2}
              onChange={(e) => setThresholds({ ...thresholds, minTemp: parseFloat(e.target.value) })}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Température maximale"
              type="number"
              value={thresholds.maxTemp || 8}
              onChange={(e) => setThresholds({ ...thresholds, maxTemp: parseFloat(e.target.value) })}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleThresholdsUpdate}>
          Mettre à jour
        </Button>
      </Paper>
    </Box >
  );
}

export default AdminPanel;
import React, { useState } from "react";
import axios from "axios";

function SensorForm({ fetchLastData, setTemperature, setHumidity }) {
  const [temperature, setLocalTemperature] = useState("");
  const [humidity, setLocalHumidity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://192.168.124.93:8000/data/", {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
      })
      .then(() => {
        fetchLastData();
        setLocalTemperature(""); // Reset local state
        setLocalHumidity("");    // Reset local state
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement :", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="sensor-form">
      <input
        type="number"
        placeholder="Température (°C)"
        value={temperature}
        onChange={(e) => setLocalTemperature(e.target.value)}
        className="input-field"
      />
      <input
        type="number"
        placeholder="Humidité (%)"
        value={humidity}
        onChange={(e) => setLocalHumidity(e.target.value)}
        className="input-field"
      />
      <button type="submit" className="submit-button">
        Soumettre
      </button>
    </form>
  );
}

export default SensorForm;

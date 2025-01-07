// src/components/MessageManager.js
import React from "react";
import axios from "axios";

const MessageManager = () => {
  // Envoyer une alerte Telegram
  const handleTelegramAlert = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/send_telegram_alert/", {
        chat_id: "1396895817", // Remplacez par votre chat ID
        message: "Alerte : Température critique détectée!",
      });
      console.log("Telegram alert sent:", response.data);
    } catch (error) {
      console.error("Error sending Telegram alert:", error);
    }
  };

  // Envoyer une alerte SMS via Twilio
  const handleTwilioAlert = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/send_twilio_alert/", {
        to_phone_number: "+13156287548", // Remplacez par le numéro de téléphone
        message: "Alerte : Température critique détectée!",
      });
      console.log("Twilio alert sent:", response.data);
    } catch (error) {
      console.error("Error sending Twilio alert:", error);
    }
  };

  return (
    <div>
      <h2>Envoyer des Alertes</h2>
      <button onClick={handleTelegramAlert}>Envoyer une alerte Telegram</button>
      <button onClick={handleTwilioAlert}>Envoyer une alerte Whatsapp</button>
    </div>
  );
};

export default MessageManager;
const express = require("express");
const router = express.Router();
const evenementController = require("../Controller/PlanningController");

// Routes pour la gestion des événements
router.post("/evenements", evenementController.addEvenement); // Ajouter un événement
router.get("/evenements", evenementController.getAllEvenements); // Récupérer tous les événements
router.get("/evenements/:id", evenementController.getEvenementById); // Récupérer un événement par ID
router.put("/evenements/:id", evenementController.updateEvenement); // Modifier un événement
router.delete("/evenements/:id", evenementController.deleteEvenement); // Supprimer un événement

// Routes pour la gestion des inscriptions aux événements
router.post("/inscriptions", evenementController.inscrireEvenement); // Inscrire un patient à un événement
router.get("/inscriptions/:id_evenement", evenementController.getInscriptionsByEvenement); // Récupérer les inscriptions d'un événement
router.delete("/inscriptions/:id_evenement/:id_patient", evenementController.annulerInscription); // Annuler une inscription

module.exports = router;

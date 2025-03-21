const express = require("express");
const router = express.Router();
const rendezVousController = require("../Controller/PlanningController");

router.post("/rendezVous", rendezVousController.addRendezVous);
router.get("/rendezVous", rendezVousController.getAllRendezVous);
router.get("/rendezVousById/:id", rendezVousController.getRendezVousById);
router.get("/rendezVous/Psychologue/:id_psychologue", rendezVousController.getRendezVousByPsychologue);
router.put("/rendezVous/:id", rendezVousController.updateRendezVous);
router.delete("/rendezVous/:id", rendezVousController.deleteRendezVous);
router.get("/rendezVous/statut/:statut", rendezVousController.getRendezVousByStatut);

module.exports = router;

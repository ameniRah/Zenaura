const express = require("express");
const router = express.Router();
const dispoController = require("../Controller/PlanningController");

router.post("/disponibilite", dispoController.addDisponibilite);
router.get("/disponibilites", dispoController.getAllDisponibilites);
router.get("/disponibilitesByid/:id", dispoController.getDisponibiliteById);
router.get("/disponibilites/psychologue/:id_psychologue", dispoController.getDisponibilitesByPsychologue);
router.get("/disponibilites/statut/:statut", dispoController.getDisponibilitesByStatut);
router.delete("/disponibilites/:id",dispoController.deleteDisponibilite);
router.put("/disponibilites/:id",dispoController.updateDisponibilite);


module.exports = router;
const express = require("express");
const router = express.Router();
const notificationController = require("../Controller/PlanningController");

router.get("/notifications/:id_patient", notificationController.getNotificationsByPatient);
router.put("/notifications/:id/lu", notificationController.markNotificationAsRead);


module.exports = router;

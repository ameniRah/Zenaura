const express = require("express");
const router = express.Router();
const commentController = require("../Controller/ForumController");

router.post("/addComment/", commentController.addCommentaire);
router.get("/getallComment/", commentController.getallCommentaire);
router.get("/getCommentbyId/:id", commentController.getCommentaireById);
router.delete("/deleteComment/:id",commentController.deleteComment);
router.put("/updateComment/:id",commentController.updateComment);







module.exports = router;
const express = require("express");
const router = express.Router();
const postController = require("../Controller/ForumController");

router.post("/addPost/", postController.addPost);
router.get("/getallPost/", postController.getallPost);
router.get("/getPostbyId/:id", postController.getPostById);
router.delete("/deletePost/:id",postController.deletePost);
router.put("/updatePost/:id",postController.updatePost);







module.exports = router;
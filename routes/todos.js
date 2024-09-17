const express = require("express");

const todosController = require("../controllers/todos");

const router = express.Router();

router.get("/", todosController.getTodos);
router.get("/:id", todosController.getSingleTodos);
router.post("/", todosController.createTodos);
router.patch("/:id", todosController.updateTodos);
router.delete("/:id", todosController.deleteTodos);

module.exports = router;

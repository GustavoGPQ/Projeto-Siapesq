import { Router, json } from "express";
import { createUsers, getUsers, loginUser } from "./controllers/userController.mjs";
import { verificaLogin } from "./middleware/autheticator.mjs";
import { createHidro2, createHidrocord } from "./controllers/hidroController.mjs";

const router = Router()

router.use(json())

// Rota Usuarios

router.get('/users' ,getUsers)
      .post('/sign', createUsers)
      .post('/login', loginUser)

// Rota Hidro

router.post('/teste', createHidro2)
      .post('/teste2', createHidrocord)

export default router
import { Router, json } from "express";
import { createUsers, getUsers, loginUser } from "./controllers/userController.mjs";
import { verificaLogin } from "./middleware/autheticator.mjs";
import { createHidro2, createHidrocord, deleteHidro, hidroIndexByUserLog } from "./controllers/hidroController.mjs";

const router = Router()

router.use(json())

// Rota Usuarios

router.get('/users' ,verificaLogin,getUsers)
      .post('/sign', createUsers)
      .post('/login', loginUser)

// Rota Hidro

router.post('/crateHidro',verificaLogin ,createHidro2)
      .post('/createHidroCord',verificaLogin, createHidrocord)
      .get('/hidroUser',verificaLogin,hidroIndexByUserLog )
      .delete('/del',verificaLogin ,deleteHidro)
      

export default router
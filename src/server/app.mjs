import express from "express";
import router from "./router.mjs";
import cors from "cors"

const app = express();
const port = 3005;

app.use(cors({
  origin:'http://localhost:3000',
  methods:['GET','POST'],
  allowedHeaders: ['Content-Type',"Authorization"]
}));
app.use(express.json());
app.use(router)

app.get('/',(req,res) =>{
  res.status(200).send('OPAA')
})

app.listen(port, () => {
  console.log(`Código rodando em : http://localhost:${port}/`);
});
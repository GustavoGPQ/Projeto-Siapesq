import express from "express";
import router from "./router.mjs";

const app = express();
const port = 3001;

app.use(router)
app.use(express.json());

app.get('/',(req,res) =>{
  res.status(200).send('OPAA')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

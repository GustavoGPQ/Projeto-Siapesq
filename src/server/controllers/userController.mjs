import dbKnex from '../database/db_config.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//---------------PUXAR USERS-------------------------
export const getUsers= async (req,res) => {
  const usuarios = await dbKnex("usuarios").select("*");
  res.status(200).json({ usuarios });

  if(!usuarios){
    res.status(400).json({ message: "Nenhum usuario cadastrado" });
    return;
  }   
}

//---------------CADASTRAR USERS-------------------------

export const createUsers = async (req, res) => {
    const { nome, senha, email, telefone } = req.body;

  console.log('nome',nome);
  console.log('senha',senha);
  console.log('email',email);
  console.log('telefone',telefone);
  if(!nome, !email, !senha, !telefone){
    res.status(400).json({message:"Digite todos os dados nescessarios"})}
  
  try {
    const criptsenha = await bcrypt.hash(senha, 10)
    const usuarioNovo = await dbKnex("usuarios").insert({ nome, senha:criptsenha, email, telefone });
    res.status(200).json({ 
      usuarioNovo,
      "message":"usuario criado com sucesso !"
     });
  } catch (error) {
    res.status(400).json({ message: "Erro ao cadastrar", error });
  }
    
}

//---------------LOGIN USERS-------------------------

export const loginUser = async (req,res) => {
  const {  senha, email  } = req.body;
  
  const usuarioLog = await dbKnex("usuarios").where({ email }).first(); //parte mais importante - armazena o usuario

  if (!usuarioLog) {
    res.status(401).json({ message: "Esse usuario não existe" });
    return;
  }

  const senhadcpt = await bcrypt.compare(senha, usuarioLog.senha);

  if(!senhadcpt){
    res.status(400).json({ message: "Senha incorreta" });
    return;
  }

  const token = jwt.sign({ id :usuarioLog.id  }, "LOGIN", {
    expiresIn: "24h",
  });
  res.status(200).json({ token });
}
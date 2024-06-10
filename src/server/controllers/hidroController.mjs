
import dbKnex from '../database/db_config.mjs'

export const createHidro2 = async (req, res) => {
  const { nome, iduser, id} = req.body;

  if (!nome) {
    return res.status(400).json({ message: "Digite o nome da Hidro" });
  }

  if(!id){
    return res.status(400).json({ message: "Digite o id da Hidro" });
  }

  try {
    const hidroCadastrado = await dbKnex('hidro').insert({nome,iduser,id});
    res.status(200).json({ hidroCadastrado });
  } catch (error){
    console.log(error);
    res.status(500).json({ message: "Erro ao cadastrar a hidro", error });
  }
};

export const createHidrocord = async (req, res) => {
  const { hidroid, poligono } = req.body;

  if (!hidroid) {
    return res.status(400).json({ message: "Forneça o ID da Hidro" });
  }

  if (!poligono || poligono.length === 0) {
    return res.status(400).json({ message: "Forneça as coordenadas do polígono" });
  }

  try {

    let latitude = poligono.x;
    let longitude = poligono.y;

    await dbKnex('hidrocord').insert({hidroid,latitude,longitude});

    res.status(200).json({ message: "Coordenadas cadastradas com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar as coordenadas", error });
    console.log(error);
  }
};



//PUXAR HIDROELÉTRICAS CADASTRADAS//
export const getHidro= async (req,res) => {
  const hidro = await dbKnex("hidro").select("*");
  const hidroCord = await dbKnex("hidrocord").select("*");

  res.status(200).json({hidro,hidroCord});

  if(!hidro){
    res.status(400).json({ message: "Nenhuma hidro cadastrado" });
    return;
  }   
}

//----------------------------------------------


//
export const deleteHidro = async (req, res) => {
  try {
      const { hidroId } = req.body;
      console.log('Usuário:', req.usuario);
      
      const hidro = await dbKnex("hidro").where({ id: hidroId }).first();
      console.log(hidro);

      if (req.usuario !== hidro?.iduser) {
          return res.status(401).json({ message: "Não autorizado" });
      }

      await dbKnex("hidrocord").where({hidroid: hidroId}).del();
      await dbKnex("hidro").where({ id: hidroId }).del();
      
      res.status(200).json({ message: hidro });
  } catch (error) {
      console.error("Erro ao excluir hidro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });  
  }
}

export const hidroIndexByUserLog = async (req, res) => {
  try {
    const userId = req.usuario; 

    const hidros = await dbKnex("hidro").where({ iduser: userId });

    res.status(200).json({ hidros });
  } catch (error) {
    console.error("Erro ao listar hidros do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
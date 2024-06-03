
import dbKnex from '../database/db_config.mjs'


export const createHidro = async (req,res) => {
    const { nome, poligono } = req.body 
    

  
if(!nome){
  res.status(400).json({message:"Digite o nome da Hidro"})
}
if(!coordenadasx){
  res.status(400).json({message:"Digite a lagitude"})
}
if(!coordenadasy){
  res.status(400).json({message:"Digite a "})
}
  
  try {
      const hidroCadastrado = await dbKnex('hidro').insert({ nome })
      //--------como-pegar-o-id-de-hidrocadastrado----------//

      let contador = 0
      while (contador<poligono.length){
        let latitude = poligono[contador][0]
        let longitude = poligono[contador][1]
        const cordHidro = await dbKnex ('hidrocord').insert({ hidroid, longitude, latitude }).returning('hidroid')
        contador = contador + 1
        
      }
      
      
      res.status(200).json({hidroCadastrado}) 
  } catch (error) {
      res.status(500).json({message:"Erro ao cadastrar", error})
  }
}

// export const createHidro2 = async (req, res) => {
//   const { nome, poligono } = req.body;

//   if (!nome) {
//     return res.status(400).json({ message: "Digite o nome da Hidro" });
//   }

//   if (!poligono || !Array.isArray(poligono) || poligono.length === 0) {
//     return res.status(400).json({ message: "Forneça as coordenadas do polígono" });
//   }

//   for (let ponto of poligono) {
//     if (!Array.isArray(ponto) || ponto.length !== 2) {
//       return res.status(400).json({ message: "Cada ponto do polígono deve ser um array com duas coordenadas" });
//     }
//   }

//   try {
//     await dbKnex.transaction(async trx => {
//       const [hidroCadastrado] = await trx('hidro').insert({ nome }).returning('*');

//       const coordenadas = poligono.map(([latitude, longitude]) => ({
//         hidroid: hidroCadastrado.id,
//         latitude,
//         longitude
//       }));

//       await trx('hidrocord').insert(coordenadas);

//       res.status(200).json({ hidroCadastrado });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Erro ao cadastrar", error });
//   }
// };



export const createHidro2 = async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ message: "Digite o nome da Hidro" });
  }

  try {
    const hidroCadastrado = await dbKnex('hidro').insert({ nome }).returning('*');
    res.status(200).json({ hidroCadastrado });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar a hidro", error });
  }
};

// export const createHidrocord = async (req, res) => {
//   const { hidroid, poligono } = req.body;

//   if (!hidroid) {
//     return res.status(400).json({ message: "Forneça o ID da Hidro" });
//   }

//   if (!poligono || !Array.isArray(poligono) || poligono.length === 0) {
//     return res.status(400).json({ message: "Forneça as coordenadas do polígono" });
//   }

//   for (let ponto of poligono) {
//     if (!Array.isArray(ponto) || ponto.length !== 2) {
//       return res.status(400).json({ message: "Cada ponto do polígono deve ser um array com duas coordenadas" });
//     }
//   }

//   try {
//     const coordenadas = poligono.map(([latitude, longitude]) => ({
//       hidroid,
//       latitude,
//       longitude
//     }));

//     await dbKnex('hidrocord').insert(coordenadas);

//     res.status(200).json({ message: "Coordenadas cadastradas com sucesso" });
//   } catch (error) {
//     res.status(500).json({ message: "Erro ao cadastrar as coordenadas", error });
//   }
// };

export const createHidrocord = async (req, res) => {
  const { hidroid, poligono } = req.body;

  if (!hidroid) {
    return res.status(400).json({ message: "Forneça o ID da Hidro" });
  }

  if (!poligono || !Array.isArray(poligono) || poligono.length === 0) {
    return res.status(400).json({ message: "Forneça as coordenadas do polígono" });
  }

  // for (let ponto of poligono) {
  //   if (typeof ponto !== 'object' || !('latitude' in ponto) || !('longitude' in ponto)) {
  //     return res.status(400).json({ message: "Cada ponto do polígono deve ser um objeto com propriedades latitude e longitude" });
  //   }
  // }

  try {
    const coordenadas = poligono.map(({ latitude, longitude }) => ({
      hidroid,
      latitude,
      longitude
    }));

    console.log(coordenadas);

    await dbKnex('hidrocord').insert(coordenadas);

    res.status(200).json({ message: "Coordenadas cadastradas com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar as coordenadas", error });
  }
};
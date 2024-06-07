import jwt from 'jsonwebtoken'

export const verificaLogin = (req,res,next) => {
    try {  
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
      const usuario = jwt.verify(token, 'LOGIN')
      req.usuario = usuario.id
      console.log('oi', req.usuario);
  
      next()
        
    } catch (error) {
        return res.status(401).send({error : 'Falha na autentificação'})
        
    }
  
  }

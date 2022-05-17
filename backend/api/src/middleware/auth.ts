import jwt from  "jsonwebtoken"


export interface JWTData {
  user_id: string
  
}

export const generateAccessToken = (data :  JWTData) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1800s' });
}

// Middleware
export const authenticated = () => authenticateToken

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, data: JWTData) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user_data = data
  
      next()
    })
  }
interface Controller {

}


declare interface User {
  user_id  : string,
  username: string,
  email: string
}


declare interface CreateUserResponse {
  message: string
}


interface JWTData {
  user_id: string
  
}

